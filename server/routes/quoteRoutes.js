import express from 'express';
import {
  generateQuote,
  getQuotes,
  getQuoteById,
  deleteQuote,
  clearHistory,
  getFavourites,
  toggleFavourite,
  getStats,
  getDailyQuote,
  exportQuotes,
} from '../controllers/quoteController.js';
import { quoteGenerateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Specific routes before param :id routes
router.post('/generate', quoteGenerateLimiter, generateQuote);
router.get('/favourites', getFavourites);
router.get('/stats', getStats);
router.get('/daily', getDailyQuote);
router.get('/export', exportQuotes);

// Collection routes
router.route('/')
  .get(getQuotes)
  .delete(clearHistory);

// Single item routes
router.route('/:id')
  .get(getQuoteById)
  .delete(deleteQuote);

router.patch('/:id/favourite', toggleFavourite);

export default router;
