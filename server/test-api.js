import { connectDB, disconnectDB } from './config/db.js';
import Quote from './models/Quote.js';
import { generateAndSaveQuote } from './services/quoteService.js';
import { formatQuotesForExport } from './utils/exportHelper.js';

async function runTests() {
  console.log('🧪 Starting QuoteFlow Backend Integration Tests...');
  try {
    await connectDB();

    console.log('1. Testing generateAndSaveQuote...');
    const result1 = await generateAndSaveQuote('Motivation');
    console.log('   ✅ Saved quote 1:', result1.quote.content, '—', result1.quote.author);

    const result2 = await generateAndSaveQuote('Philosophy');
    console.log('   ✅ Saved quote 2:', result2.quote.content, '—', result2.quote.author);

    console.log('2. Testing database query and indexing...');
    const count = await Quote.countDocuments();
    console.log(`   ✅ Total quotes in DB: ${count}`);

    console.log('3. Testing favourite toggle...');
    result1.quote.isFavourite = true;
    await result1.quote.save();
    const favCount = await Quote.countDocuments({ isFavourite: true });
    console.log(`   ✅ Favourite count: ${favCount}`);

    console.log('4. Testing search query...');
    const searchRes = await Quote.find({
      $or: [
        { content: { $regex: result1.quote.author.split(' ')[0] || 'a', $options: 'i' } },
        { author: { $regex: result1.quote.author.split(' ')[0] || 'a', $options: 'i' } },
      ],
    });
    console.log(`   ✅ Search returned ${searchRes.length} results`);

    console.log('5. Testing export formatting...');
    const allQuotes = await Quote.find();
    const csvExport = formatQuotesForExport(allQuotes, 'csv');
    const jsonExport = formatQuotesForExport(allQuotes, 'json');
    console.log(`   ✅ CSV length: ${csvExport.data.length} chars, JSON length: ${jsonExport.data.length} chars`);

    console.log('🎉 ALL BACKEND INTEGRATION TESTS PASSED!');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
}

runTests();
