const OpenAI = require('openai');
const Chatbot = require('../models/Chatbot');
const ChatbotInteraction = require('../models/ChatbotInteraction');

class AIChatbotService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    // Process user message with AI and get intelligent response
    async processMessage(userId, message) {
        try {
            // Get conversation history
            const history = await this.getConversationHistory(userId);
            
            // Prepare conversation context
            const conversationContext = this.prepareContext(history, message);
            
            // Get AI response
            const response = await this.getAIResponse(conversationContext);
            
            // Save interaction
            await this.saveInteraction(userId, message, response);
            
            return response;
        } catch (error) {
            console.error('AI Chatbot Error:', error);
            throw new Error('Failed to process message');
        }
    }

    // Get conversation history for context
    async getConversationHistory(userId) {
        return await ChatbotInteraction.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(5);
    }

    // Prepare conversation context for AI
    prepareContext(history, currentMessage) {
        const context = history.map(h => (
            `User: ${h.userMessage}\nBot: ${h.botResponse}`
        )).join('\n');

        return `${context}\nUser: ${currentMessage}\nBot:`;
    }

    // Get response from OpenAI
    async getAIResponse(context) {
        const completion = await this.openai.createChatCompletion({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful real estate assistant that provides accurate and relevant information about properties and housing."
                },
                {
                    role: "user",
                    content: context
                }
            ],
            max_tokens: 150,
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 0.2,
            presence_penalty: 0.1
        });
        const response = completion.data.choices[0].message.content.trim();
        
        // Analyze sentiment
        const sentiment = await this.analyzeSentiment(context);
        
        return {
            text: response,
            sentiment: sentiment
        };
    }

    // Analyze message sentiment
    async analyzeSentiment(text) {
        const completion = await this.openai.createChatCompletion({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "Analyze the sentiment of the following text and respond with only one word: POSITIVE, NEGATIVE, or NEUTRAL"
                },
                {
                    role: "user",
                    content: text
                }
            ],
            max_tokens: 10,
            temperature: 0
        });

        return completion.data.choices[0].message.content.trim();
    }
    // Save chat interaction
    async saveInteraction(userId, userMessage, botResponse) {
        await ChatbotInteraction.create({
            user: userId,
            userMessage,
            botResponse,
            timestamp: new Date()
        });
    }

    // Get chatbot analytics
    async getChatbotAnalytics(startDate, endDate) {
        return await ChatbotInteraction.aggregate([
            {
                $match: {
                    timestamp: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    totalInteractions: { $sum: 1 },
                    uniqueUsers: { $addToSet: "$user" }
                }
            },
            {
                $project: {
                    date: "$_id",
                    totalInteractions: 1,
                    uniqueUsers: { $size: "$uniqueUsers" }
                }
            },
            { $sort: { date: 1 } }
        ]);
    }

    // Analyze common user queries
    async analyzeUserQueries() {
        return await ChatbotInteraction.aggregate([
            {
                $group: {
                    _id: "$userMessage",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);
    }
}

module.exports = AIChatbotService;