import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for consistent error extraction
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred while communicating with the server.';
    return Promise.reject(new Error(message));
  }
);

export const quoteAPI = {
  // Generate quote from external API & store in MongoDB
  generateQuote: (category = null) =>
    api.post('/quotes/generate', { category }),

  // Get paginated quotes with search, filter, and sorting
  getQuotes: (params = {}) =>
    api.get('/quotes', { params }),

  // Get single quote by ID
  getQuoteById: (id) =>
    api.get(`/quotes/${id}`),

  // Delete quote by ID
  deleteQuote: (id) =>
    api.delete(`/quotes/${id}`),

  // Clear quote history
  clearHistory: (keepFavourites = false) =>
    api.delete('/quotes', { params: { keepFavourites } }),

  // Get favourite quotes
  getFavourites: (params = {}) =>
    api.get('/quotes/favourites', { params }),

  // Toggle or update favourite status
  toggleFavourite: (id, isFavourite = null) =>
    api.patch(`/quotes/${id}/favourite`, isFavourite !== null ? { isFavourite } : {}),

  // Get dashboard statistics
  getStats: () =>
    api.get('/quotes/stats'),

  // Get quote of the day
  getDailyQuote: () =>
    api.get('/quotes/daily'),

  // Get export URL
  getExportUrl: (format = 'json', filter = 'all') =>
    `/api/quotes/export?format=${format}&filter=${filter}`,
};

export default api;
