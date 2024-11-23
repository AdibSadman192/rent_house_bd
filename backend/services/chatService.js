const AWS = require('aws-sdk');
const sharp = require('sharp');
const axios = require('axios');
const cheerio = require('cheerio');
const { Readable } = require('stream');
const Message = require('../models/Message');
const { getAudioDurationInSeconds } = require('get-audio-duration');

class ChatService {
  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  // File upload handlers
  async uploadFile(file, type) {
    const key = `uploads/${type}/${Date.now()}-${file.originalname}`;
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    const result = await this.s3.upload(params).promise();
    return {
      url: result.Location,
      key: result.Key,
    };
  }

  async processImage(file) {
    // Generate thumbnail
    const thumbnail = await sharp(file.buffer)
      .resize(300, 300, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Upload original
    const original = await this.uploadFile(file, 'images');

    // Upload thumbnail
    const thumbnailFile = {
      buffer: thumbnail,
      originalname: `thumb-${file.originalname}`,
      mimetype: 'image/jpeg',
    };
    const thumbnailResult = await this.uploadFile(thumbnailFile, 'thumbnails');

    return {
      type: 'image',
      url: original.url,
      thumbnail: thumbnailResult.url,
      filename: file.originalname,
      filesize: file.size,
      mimeType: file.mimetype,
    };
  }

  async processVoiceMessage(file) {
    // Get audio duration
    const duration = await getAudioDurationInSeconds(Readable.from(file.buffer));

    // Upload audio file
    const result = await this.uploadFile(file, 'voice');

    return {
      type: 'voice',
      url: result.url,
      filename: file.originalname,
      filesize: file.size,
      mimeType: file.mimetype,
      duration: Math.round(duration),
    };
  }

  async processFile(file) {
    const result = await this.uploadFile(file, 'files');

    return {
      type: 'file',
      url: result.url,
      filename: file.originalname,
      filesize: file.size,
      mimeType: file.mimetype,
    };
  }

  // Link preview
  async getLinkPreview(url) {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      const metadata = {
        title: $('meta[property="og:title"]').attr('content') || $('title').text(),
        description: $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content'),
        image: $('meta[property="og:image"]').attr('content'),
        siteName: $('meta[property="og:site_name"]').attr('content'),
      };

      return {
        type: 'link',
        url,
        metadata,
      };
    } catch (error) {
      console.error('Error generating link preview:', error);
      return {
        type: 'link',
        url,
        metadata: {
          title: url,
        },
      };
    }
  }

  // Message formatting
  parseMessageFormatting(content) {
    const formatting = {
      bold: [],
      italic: [],
      code: [],
      link: [],
    };

    // Bold: **text**
    let match;
    const boldRegex = /\*\*(.*?)\*\*/g;
    while ((match = boldRegex.exec(content)) !== null) {
      formatting.bold.push({
        start: match.index,
        end: match.index + match[1].length,
      });
    }

    // Italic: *text*
    const italicRegex = /(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g;
    while ((match = italicRegex.exec(content)) !== null) {
      formatting.italic.push({
        start: match.index,
        end: match.index + match[1].length,
      });
    }

    // Code: `text`
    const codeRegex = /`(.*?)`/g;
    while ((match = codeRegex.exec(content)) !== null) {
      formatting.code.push({
        start: match.index,
        end: match.index + match[1].length,
      });
    }

    // Links: [text](url)
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    while ((match = linkRegex.exec(content)) !== null) {
      formatting.link.push({
        start: match.index,
        end: match.index + match[1].length,
        url: match[2],
      });
    }

    return formatting;
  }

  // Chat analytics
  async getChatAnalytics(chatId, timeRange = '7d') {
    const timeRanges = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    };

    const startDate = new Date(Date.now() - timeRanges[timeRange]);

    const messages = await Message.find({
      chatId,
      createdAt: { $gte: startDate },
    });

    return {
      totalMessages: messages.length,
      messagesByType: messages.reduce((acc, msg) => {
        acc[msg.type] = (acc[msg.type] || 0) + 1;
        return acc;
      }, {}),
      attachmentCount: messages.reduce((acc, msg) => acc + (msg.attachments?.length || 0), 0),
      reactionCount: messages.reduce((acc, msg) => acc + (msg.reactions?.length || 0), 0),
      averageResponseTime: this.calculateAverageResponseTime(messages),
      mostActiveHours: this.getMostActiveHours(messages),
      participantStats: this.getParticipantStats(messages),
    };
  }

  calculateAverageResponseTime(messages) {
    let totalTime = 0;
    let count = 0;

    for (let i = 1; i < messages.length; i++) {
      if (messages[i].sender !== messages[i - 1].sender) {
        const time = messages[i].createdAt - messages[i - 1].createdAt;
        if (time < 3600000) { // Only count if response is within 1 hour
          totalTime += time;
          count++;
        }
      }
    }

    return count > 0 ? Math.round(totalTime / count) : 0;
  }

  getMostActiveHours(messages) {
    const hourCounts = new Array(24).fill(0);
    
    messages.forEach(msg => {
      const hour = new Date(msg.createdAt).getHours();
      hourCounts[hour]++;
    });

    return hourCounts;
  }

  getParticipantStats(messages) {
    const stats = {};

    messages.forEach(msg => {
      if (!stats[msg.sender]) {
        stats[msg.sender] = {
          messageCount: 0,
          attachments: 0,
          reactions: 0,
          charactersTyped: 0,
        };
      }

      stats[msg.sender].messageCount++;
      stats[msg.sender].attachments += msg.attachments?.length || 0;
      stats[msg.sender].reactions += msg.reactions?.length || 0;
      stats[msg.sender].charactersTyped += msg.content?.length || 0;
    });

    return stats;
  }

  // Message backup
  async exportChatHistory(chatId, format = 'json') {
    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .populate('sender', 'name')
      .populate('recipient', 'name');

    if (format === 'json') {
      return JSON.stringify(messages, null, 2);
    }

    if (format === 'csv') {
      const csv = [
        'Date,Sender,Message,Type,Attachments,Reactions',
        ...messages.map(msg => [
          msg.createdAt,
          msg.sender.name,
          msg.content?.replace(/"/g, '""') || '',
          msg.type,
          msg.attachments?.length || 0,
          msg.reactions?.length || 0,
        ].join(','))
      ].join('\n');

      return csv;
    }

    throw new Error('Unsupported export format');
  }
}

module.exports = new ChatService();
