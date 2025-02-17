const Payment = require('../models/Payment');
const Property = require('../models/Property');
const User = require('../models/User');

class PaymentAnalyticsService {
    // Get payment statistics by time period
    static async getPaymentStatsByPeriod(startDate, endDate) {
        const stats = await Payment.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    status: 'completed'
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 },
                    byGateway: {
                        $push: {
                            gateway: "$gateway",
                            amount: "$amount"
                        }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        return stats;
    }

    // Get payment analytics by property
    static async getPropertyPaymentAnalytics(propertyId) {
        const analytics = await Payment.aggregate([
            {
                $match: {
                    property: propertyId,
                    status: 'completed'
                }
            },
            {
                $group: {
                    _id: "$paymentType",
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 },
                    averageAmount: { $avg: "$amount" }
                }
            }
        ]);

        return analytics;
    }

    // Get payment trends and patterns
    static async getPaymentTrends() {
        const currentDate = new Date();
        const lastMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1));

        const trends = await Payment.aggregate([
            {
                $match: {
                    createdAt: { $gte: lastMonth },
                    status: 'completed'
                }
            },
            {
                $group: {
                    _id: {
                        gateway: "$gateway",
                        day: { $dayOfWeek: "$createdAt" }
                    },
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.day": 1 }
            }
        ]);

        return trends;
    }

    // Get user payment behavior analytics
    static async getUserPaymentAnalytics(userId) {
        const analytics = await Payment.aggregate([
            {
                $match: {
                    user: userId,
                    status: 'completed'
                }
            },
            {
                $group: {
                    _id: "$gateway",
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 },
                    averageAmount: { $avg: "$amount" },
                    lastPayment: { $max: "$createdAt" }
                }
            }
        ]);

        return analytics;
    }

    // Get payment success rate analytics
    static async getPaymentSuccessRate(startDate, endDate) {
        const stats = await Payment.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: "$gateway",
                    totalAttempts: { $sum: 1 },
                    successfulPayments: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "completed"] }, 1, 0]
                        }
                    }
                }
            },
            {
                $project: {
                    gateway: "$_id",
                    totalAttempts: 1,
                    successfulPayments: 1,
                    successRate: {
                        $multiply: [
                            { $divide: ["$successfulPayments", "$totalAttempts"] },
                            100
                        ]
                    }
                }
            }
        ]);

        return stats;
    }
}

module.exports = PaymentAnalyticsService;