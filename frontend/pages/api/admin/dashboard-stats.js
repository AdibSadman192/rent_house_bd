import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  try {
    const [
      totalUsers,
      totalProperties,
      activeListings,
      pendingReports,
      totalRevenue,
      newUsersThisMonth
    ] = await Promise.all([
      prisma.user.count(),
      prisma.property.count(),
      prisma.property.count({ where: { status: 'active' } }),
      prisma.report.count({ where: { status: 'pending' } }),
      prisma.booking.aggregate({ 
        _sum: { totalPrice: true } 
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ]);

    res.status(200).json({
      totalUsers,
      totalProperties,
      activeListings,
      pendingReports,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      newUsersThisMonth
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
}
