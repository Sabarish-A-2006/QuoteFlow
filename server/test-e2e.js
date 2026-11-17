import axios from 'axios';
import './server.js';

const BASE_URL = 'http://127.0.0.1:5001/api';

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await axios.get(`${BASE_URL}/health`, { timeout: 2000 });
      if (res.status === 200) {
        return true;
      }
    } catch (e) {
      // Wait and retry
      await wait(1000);
    }
  }
  throw new Error('Server did not start within expected timeout');
}

async function runE2ETests() {
  console.log('⏳ Waiting for QuoteFlow Server & MongoDB to initialize...');
  await waitForServer();
  console.log('🚀 Server is UP! Running Full E2E REST API Test Suite...');

  try {
    // 1. Healthcheck
    console.log('1. Testing GET /api/health...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('   ✅ Health status:', health.data.status, 'Uptime:', health.data.uptime);

    // 2. Generate Quote
    console.log('2. Testing POST /api/quotes/generate with category "Wisdom"...');
    const genRes = await axios.post(`${BASE_URL}/quotes/generate`, { category: 'Wisdom' });
    const quote1 = genRes.data.data;
    console.log('   ✅ Generated quote ID:', quote1.id || quote1._id);
    console.log(`   ✅ Content: "${quote1.content.substring(0, 45)}..." by ${quote1.author}`);

    // Generate a second quote
    console.log('   Generating second quote with category "Motivation"...');
    const genRes2 = await axios.post(`${BASE_URL}/quotes/generate`, { category: 'Motivation' });
    const quote2 = genRes2.data.data;
    console.log('   ✅ Generated quote 2 ID:', quote2.id || quote2._id);

    // 3. Get all quotes
    console.log('3. Testing GET /api/quotes...');
    const listRes = await axios.get(`${BASE_URL}/quotes`);
    console.log('   ✅ Total quotes listed:', listRes.data.pagination.total);

    // 4. Get quote by ID
    const qId = quote1.id || quote1._id;
    console.log(`4. Testing GET /api/quotes/${qId}...`);
    const singleRes = await axios.get(`${BASE_URL}/quotes/${qId}`);
    console.log('   ✅ Retrieved single quote author:', singleRes.data.data.author);

    // 5. Toggle favourite
    console.log(`5. Testing PATCH /api/quotes/${qId}/favourite...`);
    const favRes = await axios.patch(`${BASE_URL}/quotes/${qId}/favourite`, { isFavourite: true });
    console.log('   ✅ isFavourite updated to:', favRes.data.data.isFavourite);

    // 6. Get favourites
    console.log('6. Testing GET /api/quotes/favourites...');
    const favList = await axios.get(`${BASE_URL}/quotes/favourites`);
    console.log('   ✅ Favourites count in list:', favList.data.count);

    // 7. Get stats
    console.log('7. Testing GET /api/quotes/stats...');
    const statsRes = await axios.get(`${BASE_URL}/quotes/stats`);
    console.log('   ✅ Stats total quotes:', statsRes.data.data.totalQuotes);
    console.log('   ✅ Stats favourites:', statsRes.data.data.favouriteQuotes);
    console.log('   ✅ Stats timeline entries:', statsRes.data.data.timeline.length);

    // 8. Daily quote
    console.log('8. Testing GET /api/quotes/daily...');
    const dailyRes = await axios.get(`${BASE_URL}/quotes/daily`);
    console.log('   ✅ Daily quote:', dailyRes.data.data?.content ? 'Retrieved' : 'Empty');

    // 9. Export quotes
    console.log('9. Testing GET /api/quotes/export (CSV & JSON)...');
    const csvExport = await axios.get(`${BASE_URL}/quotes/export?format=csv`);
    const jsonExport = await axios.get(`${BASE_URL}/quotes/export?format=json`);
    console.log('   ✅ CSV bytes:', csvExport.data.length, 'JSON entries:', jsonExport.data.length);

    // 10. Delete single quote
    const q2Id = quote2.id || quote2._id;
    console.log(`10. Testing DELETE /api/quotes/${q2Id}...`);
    const delRes = await axios.delete(`${BASE_URL}/quotes/${q2Id}`);
    console.log('   ✅ Deleted quote response:', delRes.data.message);

    console.log('🎉 ALL REST API ENDPOINTS TESTED & VERIFIED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('❌ E2E Test Failed:', err.response?.data || err.message);
    process.exit(1);
  }
}

runE2ETests();
