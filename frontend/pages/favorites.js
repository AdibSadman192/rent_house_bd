import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import PropertyCard from '@/components/properties/PropertyCard';
import useSession from '@/hooks/useSession';

const FavoritesPage = () => {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useSession();

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/user/favorites', {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }

      const data = await response.json();
      setFavorites(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setLoading(false);
    }
  };

  const removeFavorite = async (propertyId) => {
    try {
      const response = await fetch(`/api/user/favorites/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove favorite');
      }

      setFavorites(favorites.filter(fav => fav.id !== propertyId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>My Favorites | RentHouseBD</title>
          <meta name="description" content="View and manage your favorite properties" />
        </Head>
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Sign In</h1>
              <p className="text-gray-600 mb-8">
                Sign in to view and manage your favorite properties
              </p>
              <button
                onClick={() => router.push('/signin')}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>My Favorites | RentHouseBD</title>
        <meta name="description" content="View and manage your favorite properties" />
      </Head>

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
            <p className="text-gray-600">
              {loading
                ? 'Loading your favorite properties...'
                : `${favorites.length} properties saved`}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-gray-100 rounded-xl animate-pulse h-[400px]"
                />
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Favorites Yet</h2>
              <p className="text-gray-600 mb-8">
                Start browsing properties and save your favorites to view them here
              </p>
              <button
                onClick={() => router.push('/search')}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Browse Properties
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {favorites.map((property) => (
                <motion.div
                  key={property.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="relative">
                    <PropertyCard property={property} />
                    <button
                      onClick={() => removeFavorite(property.id)}
                      className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default FavoritesPage;
