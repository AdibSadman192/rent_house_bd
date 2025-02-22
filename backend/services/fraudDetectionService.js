const Payment = require('../models/Payment');
const User = require('../models/User');
const Property = require('../models/Property');

class FraudDetectionService {
    // Risk scoring for transactions
    static async calculateTransactionRiskScore(payment, user) {
        let riskScore = 0;

        // User behavior analysis
        const userHistory = await this.getUserTransactionHistory(user._id);
        if (userHistory.unusualPatterns) riskScore += 20;
        if (userHistory.rapidTransactions) riskScore += 15;

        // Amount analysis
        if (payment.amount > userHistory.averageAmount * 3) riskScore += 25;

        // Location-based analysis
        if (await this.isLocationMismatch(payment, user)) riskScore += 30;

        // Time-based analysis
        if (this.isUnusualTransactionTime(payment)) riskScore += 10;

        return riskScore;
    }

    // Analyze user transaction history
    static async getUserTransactionHistory(userId) {
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const transactions = await Payment.find({
            user: userId,
            createdAt: { $gte: last24Hours }
        });

        return {
            unusualPatterns: this.detectUnusualPatterns(transactions),
            rapidTransactions: transactions.length > 5,
            averageAmount: this.calculateAverageAmount(transactions)
        };
    }

    // Detect unusual patterns in transactions
    static detectUnusualPatterns(transactions) {
        if (transactions.length < 2) return false;

        // Check for identical amounts in rapid succession
        const amounts = transactions.map(t => t.amount);
        const uniqueAmounts = new Set(amounts);
        if (uniqueAmounts.size === 1 && transactions.length > 2) return true;

        // Check for ascending/descending patterns
        return this.hasSequentialPattern(amounts);
    }

    // Check for sequential patterns in amounts
    static hasSequentialPattern(amounts) {
        let ascending = true;
        let descending = true;

        for (let i = 1; i < amounts.length; i++) {
            if (amounts[i] <= amounts[i-1]) ascending = false;
            if (amounts[i] >= amounts[i-1]) descending = false;
        }

        return ascending || descending;
    }

    // Calculate average transaction amount
    static calculateAverageAmount(transactions) {
        if (transactions.length === 0) return 0;
        const total = transactions.reduce((sum, t) => sum + t.amount, 0);
        return total / transactions.length;
    }

    // Check for location mismatch
    static async isLocationMismatch(payment, user) {
        // Implementation would depend on having location data
        // This is a placeholder for the actual implementation
        return false;
    }

    // Check if transaction time is unusual
    static isUnusualTransactionTime(payment) {
        const hour = new Date(payment.createdAt).getHours();
        return hour >= 0 && hour <= 5; // Consider transactions between midnight and 5 AM as unusual
    }

    // Validate payment against fraud rules
    static async validatePayment(payment, user) {
        const riskScore = await this.calculateTransactionRiskScore(payment, user);
        
        return {
            isValid: riskScore < 70,
            riskScore,
            riskLevel: this.getRiskLevel(riskScore),
            requiresManualReview: riskScore >= 50
        };
    }

    // Get risk level based on score
    static getRiskLevel(score) {
        if (score < 30) return 'LOW';
        if (score < 50) return 'MEDIUM';
        if (score < 70) return 'HIGH';
        return 'CRITICAL';
    }
}

module.exports = FraudDetectionService;