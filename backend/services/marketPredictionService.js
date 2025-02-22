const Property = require('../models/Property');
const Payment = require('../models/Payment');

class MarketPredictionService {
    // Predict market trends based on historical data
    static async predictMarketTrends(locationId, propertyType) {
        const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
        
        // Get historical price data
        const priceHistory = await Property.aggregate([
            {
                $match: {
                    location: locationId,
                    propertyType: propertyType,
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    averagePrice: { $avg: "$price" },
                    totalProperties: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        return this.calculatePredictions(priceHistory);
    }

    // Calculate price predictions using simple linear regression
    static calculatePredictions(priceHistory) {
        if (priceHistory.length < 2) {
            return {
                trend: 'insufficient_data',
                prediction: null,
                confidence: 0
            };
        }

        const data = priceHistory.map((item, index) => ({
            x: index,
            y: item.averagePrice
        }));

        const n = data.length;
        let sumX = 0;
        let sumY = 0;
        let sumXY = 0;
        let sumXX = 0;

        // Calculate sums for linear regression
        data.forEach(point => {
            sumX += point.x;
            sumY += point.y;
            sumXY += point.x * point.y;
            sumXX += point.x * point.x;
        });

        // Calculate slope and intercept
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Predict next month's value
        const nextMonthPrediction = slope * n + intercept;

        // Calculate R-squared for confidence
        const yMean = sumY / n;
        let totalSS = 0;
        let residualSS = 0;

        data.forEach(point => {
            const yPred = slope * point.x + intercept;
            totalSS += Math.pow(point.y - yMean, 2);
            residualSS += Math.pow(point.y - yPred, 2);
        });

        const rSquared = 1 - (residualSS / totalSS);

        return {
            trend: slope > 0 ? 'upward' : 'downward',
            prediction: nextMonthPrediction,
            confidence: rSquared,
            historicalData: priceHistory
        };
    }

    // Get market demand indicators
    static async getMarketDemandIndicators(locationId) {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const indicators = await Property.aggregate([
            {
                $match: {
                    location: locationId,
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: "$propertyType",
                    viewCount: { $sum: "$views" },
                    inquiryCount: { $sum: "$inquiries" },
                    averageTimeOnMarket: { $avg: { $subtract: ["$updatedAt", "$createdAt"] } }
                }
            }
        ]);

        return this.analyzeDemandIndicators(indicators);
    }

    // Analyze demand indicators to provide market insights
    static analyzeDemandIndicators(indicators) {
        const insights = indicators.map(indicator => {
            const demandScore = this.calculateDemandScore(
                indicator.viewCount,
                indicator.inquiryCount,
                indicator.averageTimeOnMarket
            );

            return {
                propertyType: indicator._id,
                demandScore,
                marketStatus: this.getMarketStatus(demandScore),
                metrics: {
                    views: indicator.viewCount,
                    inquiries: indicator.inquiryCount,
                    averageDaysOnMarket: Math.floor(indicator.averageTimeOnMarket / (1000 * 60 * 60 * 24))
                }
            };
        });

        return insights;
    }

    // Calculate demand score based on various metrics
    static calculateDemandScore(views, inquiries, timeOnMarket) {
        const viewWeight = 0.3;
        const inquiryWeight = 0.5;
        const timeWeight = 0.2;

        const normalizedViews = Math.min(views / 1000, 1);
        const normalizedInquiries = Math.min(inquiries / 100, 1);
        const normalizedTime = Math.max(0, 1 - (timeOnMarket / (30 * 24 * 60 * 60 * 1000)));

        return (
            normalizedViews * viewWeight +
            normalizedInquiries * inquiryWeight +
            normalizedTime * timeWeight
        ) * 100;
    }

    // Get market status based on demand score
    static getMarketStatus(score) {
        if (score >= 80) return 'HOT';
        if (score >= 60) return 'ACTIVE';
        if (score >= 40) return 'STABLE';
        if (score >= 20) return 'SLOW';
        return 'COLD';
    }
}

module.exports = MarketPredictionService;