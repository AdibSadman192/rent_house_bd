const { Configuration, OpenAIApi } = require('openai');
const Chatbot = require('../models/Chatbot');
const ChatbotInteraction = require('../models/ChatbotInteraction');

class AIChatbotService {
    constructor() {
        this.configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY
        });
        this.openai = new OpenAIApi(this.configuration);
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
        const completion = await this.openai.createCompletion({
            model: "text-davinci-003",
            prompt: context,
            max_tokens: 150,
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        });

        return completion.data.choices[0].text.trim();
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