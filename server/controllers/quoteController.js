import mongoose from 'mongoose';
import Quote from '../models/Quote.js';
import { generateAndSaveQuote, fetchQuoteOfTheDay } from '../services/quoteService.js';
import { formatQuotesForExport } from '../utils/exportHelper.js';

/**
 * @desc    Generate a new quote from external API and save to DB
 * @route   POST /api/quotes/generate
 * @access  Public
 */
export const generateQuote = async (req, res, next) => {
  try {
    const { category } = req.body || {};
    const result = await generateAndSaveQuote(category);

    res.status(201).json({
      success: true,
      message: result.isDuplicate
        ? 'Retrieved recently generated quote'
        : 'Quote generated and saved successfully',
      data: result.quote,
      isDuplicate: result.isDuplicate,
      savedNew: result.savedNew,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all quotes with search, filter, sort, and pagination
 * @route   GET /api/quotes
 * @access  Public
 */
export const getQuotes = async (req, res, next) => {
  try {
    const {
      search,
      author,
      category,
      isFavourite,
      sort = 'latest',
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Filter by favourite status
    if (isFavourite !== undefined && isFavourite !== '') {
      query.isFavourite = isFavourite === 'true' || isFavourite === true;
    }

    // Filter by category
    if (category && category.toLowerCase() !== 'all') {
      query.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
    }

    // Filter by author
    if (author && author.trim()) {
      query.author = { $regex: author.trim(), $options: 'i' };
    }

    // Search query across content and author
    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      query.$or = [{ content: searchRegex }, { author: searchRegex }, { tags: searchRegex }];
    }

    // Sort order
    let sortOptions = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'author') {
      sortOptions = { author: 1 };
    } else if (sort === 'content') {
      sortOptions = { content: 1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const [quotes, totalCount] = await Promise.all([
      Quote.find(query).sort(sortOptions).skip(skip).limit(limitNum).lean(),
      Quote.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum) || 1;

    res.json({
      success: true,
      data: quotes,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single quote by ID
 * @route   GET /api/quotes/:id
 * @access  Public
 */
export const getQuoteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid quote ID' });
    }

    const quote = await Quote.findById(id);
    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quote not found' });
    }

    res.json({
      success: true,
      data: quote,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete single quote by ID
 * @route   DELETE /api/quotes/:id
 * @access  Public
 */
export const deleteQuote = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid quote ID' });
    }

    const deleted = await Quote.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Quote not found' });
    }

    res.json({
      success: true,
      message: 'Quote deleted successfully',
      data: { id: deleted._id },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear quote history (all or keep favourites)
 * @route   DELETE /api/quotes
 * @access  Public
 */
export const clearHistory = async (req, res, next) => {
  try {
    const { keepFavourites } = req.query;
    const filter = {};

    if (keepFavourites === 'true') {
      filter.isFavourite = { $ne: true };
    }

    const result = await Quote.deleteMany(filter);

    res.json({
      success: true,
      message: `Cleared ${result.deletedCount} quote${result.deletedCount === 1 ? '' : 's'} from history`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get favourite quotes
 * @route   GET /api/quotes/favourites
 * @access  Public
 */
export const getFavourites = async (req, res, next) => {
  try {
    const { search, sort = 'latest' } = req.query;
    const query = { isFavourite: true };

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      query.$or = [{ content: searchRegex }, { author: searchRegex }];
    }

    const sortOrder = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
    const favourites = await Quote.find(query).sort(sortOrder).lean();

    res.json({
      success: true,
      count: favourites.length,
      data: favourites,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle favourite status
 * @route   PATCH /api/quotes/:id/favourite
 * @access  Public
 */
export const toggleFavourite = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid quote ID' });
    }

    const quote = await Quote.findById(id);
    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quote not found' });
    }

    // Toggle or explicitly set from body
    if (req.body && typeof req.body.isFavourite === 'boolean') {
      quote.isFavourite = req.body.isFavourite;
    } else {
      quote.isFavourite = !quote.isFavourite;
    }

    await quote.save();

    res.json({
      success: true,
      message: quote.isFavourite ? 'Added to favourites' : 'Removed from favourites',
      data: quote,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard statistics & analytics
 * @route   GET /api/quotes/stats
 * @access  Public
 */
export const getStats = async (req, res, next) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [
      totalQuotes,
      favouriteQuotes,
      quotesToday,
      uniqueAuthors,
      categoryStats,
      timelineStats,
      recentQuotes,
    ] = await Promise.all([
      Quote.countDocuments(),
      Quote.countDocuments({ isFavourite: true }),
      Quote.countDocuments({ createdAt: { $gte: startOfToday } }),
      Quote.distinct('author'),
      Quote.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]),
      Quote.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Quote.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    // Build complete last 7 days chart array including zero-count days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().slice(0, 10);
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      const found = timelineStats.find((item) => item._id === dateKey);
      last7Days.push({
        date: dateKey,
        day: dayLabel,
        count: found ? found.count : 0,
      });
    }

    res.json({
      success: true,
      data: {
        totalQuotes,
        favouriteQuotes,
        quotesToday,
        uniqueAuthorsCount: uniqueAuthors.length,
        categoryStats: categoryStats.map((c) => ({
          name: c._id || 'General',
          count: c.count,
        })),
        timeline: last7Days,
        recentQuotes,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Daily Quote
 * @route   GET /api/quotes/daily
 * @access  Public
 */
export const getDailyQuote = async (req, res, next) => {
  try {
    const dailyQuote = await fetchQuoteOfTheDay();
    res.json({
      success: true,
      data: dailyQuote,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export quotes as CSV or JSON
 * @route   GET /api/quotes/export
 * @access  Public
 */
export const exportQuotes = async (req, res, next) => {
  try {
    const { format = 'json', filter = 'all' } = req.query;
    const query = filter === 'favourites' ? { isFavourite: true } : {};

    const quotes = await Quote.find(query).sort({ createdAt: -1 });

    const exportResult = formatQuotesForExport(quotes, format);

    res.setHeader('Content-Type', exportResult.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${exportResult.filename}"`);
    res.send(exportResult.data);
  } catch (error) {
    next(error);
  }
};
