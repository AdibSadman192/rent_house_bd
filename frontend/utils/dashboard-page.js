import { useState, useEffect } from 'react';
import axios from 'axios';

// Framer Motion Animations
export const animations = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  },
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }
};

// Reusable Pagination Hook
export function usePaginatedData(apiEndpoint, initialParams = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [params, setParams] = useState(initialParams);

  const fetchData = async (resetPage = false) => {
    try {
      setLoading(true);
      const response = await axios.get(apiEndpoint, {
        params: {
          page: resetPage ? 1 : page,
          limit: 10,
          ...params
        }
      });

      const newData = response.data.data || response.data;
      
      setData(prev => 
        resetPage ? newData : [...prev, ...newData]
      );
      
      setPage(prev => resetPage ? 1 : prev + 1);
      setHasMore(newData.length === 10);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
  }, [apiEndpoint, JSON.stringify(params)]);

  return {
    data,
    loading,
    error,
    hasMore,
    page,
    setParams,
    fetchMore: () => fetchData(),
    refetch: () => fetchData(true)
  };
}

// Reusable Search and Filter Utility
export function useSearchAndFilter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const applySearchAndFilter = (items) => {
    return items.filter(item => {
      const matchesSearch = Object.values(item).some(
        value => 
          value && 
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      const matchesFilter = 
        filterStatus === 'all' || 
        item.status === filterStatus;

      return matchesSearch && matchesFilter;
    });
  };

  return {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    applySearchAndFilter
  };
}

// Global Error Handler
export function ErrorDisplay({ error, onRetry }) {
  return error ? (
    <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex items-center justify-between">
      <div>
        <h3 className="font-semibold">Error</h3>
        <p>{error}</p>
      </div>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="bg-red-100 text-red-800 px-4 py-2 rounded-lg hover:bg-red-200"
        >
          Retry
        </button>
      )}
    </div>
  ) : null;
}

// Confirmation Modal
export function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// Action Buttons Utility
export function ActionButtons({ 
  onEdit, 
  onDelete, 
  onView, 
  editLabel = 'Edit', 
  deleteLabel = 'Delete', 
  viewLabel = 'View' 
}) {
  return (
    <div className="flex items-center space-x-2">
      {onView && (
        <button 
          onClick={onView}
          className="text-blue-600 hover:text-blue-700 flex items-center"
        >
          <Eye className="w-4 h-4 mr-1" /> {viewLabel}
        </button>
      )}
      {onEdit && (
        <button 
          onClick={onEdit}
          className="text-green-600 hover:text-green-700 flex items-center"
        >
          <Edit className="w-4 h-4 mr-1" /> {editLabel}
        </button>
      )}
      {onDelete && (
        <button 
          onClick={onDelete}
          className="text-red-600 hover:text-red-700 flex items-center"
        >
          <Trash2 className="w-4 h-4 mr-1" /> {deleteLabel}
        </button>
      )}
    </div>
  );
}

// Export default to allow easier importing
export default {
  animations,
  usePaginatedData,
  useSearchAndFilter,
  ErrorDisplay,
  ConfirmationModal,
  ActionButtons
};
