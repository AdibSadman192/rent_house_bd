import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import PropertyCard from '@/components/properties/PropertyCard';
import { useSession } from '@/hooks/useSession';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { session } = useSession();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/user/favorites', {
        headers: {
          'Authorization': `Bearer ${session?.token}`
        }
      });
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (propertyId) => {
    try {
      await fetch(`/api/user/favorites/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.token}`
        }
      });
      setFavorites(favorites.filter(fav => fav.id !== propertyId));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sign in to view favorites</h2>
          <p className="text-gray-600">Please sign in to access your favorite properties.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Favorites | RentHouse BD</title>
        <meta name="description" content="View and manage your favorite properties" />
      </Head>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
      >
        <motion.div variants={itemVariants} className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {favorites.length} {favorites.length === 1 ? 'Property' : 'Properties'}
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((property) => (
                <motion.div
                  key={property.id}
                  variants={itemVariants}
                  className="relative"
                >
                  <button
                    onClick={() => removeFavorite(property.id)}
                    className="absolute right-4 top-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors duration-200"
                    title="Remove from favorites"
                  >
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </button>
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="text-center py-12 bg-white rounded-lg shadow-sm"
            >
              <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h2>
              <p className="text-gray-600 mb-4">Start adding properties to your favorites list!</p>
              <a
                href="/properties"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Browse Properties
              </a>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
};

export default FavoritesPage;
