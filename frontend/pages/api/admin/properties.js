import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { page = 1, limit = 10, filters } = JSON.parse(req.body);
      const where = {
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.type !== 'all' && { type: filters.type }),
        ...(filters.searchTerm && {
          OR: [
            { title: { contains: filters.searchTerm } },
            { location: { contains: filters.searchTerm } }
          ]
        })
      };

      const [properties, total] = await Promise.all([
        prisma.property.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          include: {
            images: true,
            owner: {
              select: { id: true, name: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.property.count({ where })
      ]);

      res.status(200).json({ properties, total });
    } catch (error) {
      console.error('Property management error:', error);
      res.status(500).json({ error: 'Failed to fetch properties' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
