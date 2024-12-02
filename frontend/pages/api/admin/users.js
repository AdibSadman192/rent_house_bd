import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { page = 1, limit = 10, filters } = JSON.parse(req.body);
      const where = {
        ...(filters.role !== 'all' && { role: filters.role }),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.searchTerm && {
          OR: [
            { name: { contains: filters.searchTerm } },
            { email: { contains: filters.searchTerm } }
          ]
        })
      };

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            avatar: true
          }
        }),
        prisma.user.count({ where })
      ]);

      res.status(200).json({ users, total });
    } catch (error) {
      console.error('User management error:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
