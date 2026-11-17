import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Quote content is required'],
      trim: true,
      minlength: [3, 'Quote must be at least 3 characters long'],
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
      default: 'Unknown',
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    isFavourite: {
      type: Boolean,
      default: false,
      index: true,
    },
    source: {
      type: String,
      default: 'quotable',
    },
    externalQuoteId: {
      type: String,
      default: null,
    },
    contentHash: {
      type: String,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound text index for powerful fuzzy / substring searching across content and author
quoteSchema.index({ content: 'text', author: 'text' });

// Compound indexes for fast sorting and filtering
quoteSchema.index({ createdAt: -1 });
quoteSchema.index({ isFavourite: 1, createdAt: -1 });
quoteSchema.index({ category: 1, createdAt: -1 });

// Helper method: generate a simplified content hash for duplicate detection
quoteSchema.statics.generateHash = function (content, author) {
  const normalized = `${content.toLowerCase().trim()}|${(author || '').toLowerCase().trim()}`;
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
};

const Quote = mongoose.model('Quote', quoteSchema);

export default Quote;
