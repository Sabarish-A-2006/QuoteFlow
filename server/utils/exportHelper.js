import { Parser } from 'json2csv';

export function formatQuotesForExport(quotes, format = 'json') {
  const cleanData = quotes.map((q) => ({
    id: q._id.toString(),
    content: q.content,
    author: q.author,
    category: q.category || 'General',
    tags: Array.isArray(q.tags) ? q.tags.join(', ') : '',
    isFavourite: q.isFavourite ? 'Yes' : 'No',
    source: q.source || 'api',
    createdAt: q.createdAt ? q.createdAt.toISOString() : '',
  }));

  if (format === 'csv') {
    const fields = ['id', 'content', 'author', 'category', 'tags', 'isFavourite', 'source', 'createdAt'];
    const json2csvParser = new Parser({ fields });
    return {
      contentType: 'text/csv',
      filename: `quoteflow-export-${Date.now()}.csv`,
      data: json2csvParser.parse(cleanData),
    };
  }

  return {
    contentType: 'application/json',
    filename: `quoteflow-export-${Date.now()}.json`,
    data: JSON.stringify(quotes, null, 2),
  };
}
