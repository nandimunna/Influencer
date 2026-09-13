import { db } from './db/database.js';

async function runTests() {
  console.log('🧪 Starting Full System Verification & Workflow Tests...\n');
  let passed = 0;
  let failed = 0;

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  };

  try {
    const influencers = db.get('influencers');
    assert(influencers.length >= 17, `Database has creators (Found: ${influencers.length})`);

    const users = db.get('users');
    assert(users.length === 4, `All 4 personas seeded (Admin, Manager, Team, Client)`);

    const momCreators = influencers.filter(i => i.primaryGenre === 'Mom & Lifestyle');
    assert(momCreators.length >= 10, `Found ${momCreators.length} Mom & Lifestyle creators`);

    const sampleBrief = db.get('brandBriefs')[0];
    assert(sampleBrief !== undefined, `Found Brand Brief: "${sampleBrief.campaignTitle}"`);

    const testMatchResponse = await fetch(`http://localhost:5000/api/ai/match/${sampleBrief.id}`, {
      headers: { 'Authorization': 'Bearer ' + (await getTestToken('admin@nexcreator.io')) }
    }).then(r => r.json());

    assert(testMatchResponse.success === true, 'AI Matchmaker API endpoint returned success');
    assert(testMatchResponse.recommendations?.length > 0, `AI recommended matches`);

    const clientResponse = await fetch(`http://localhost:5000/api/influencers`, {
      headers: { 'Authorization': 'Bearer ' + (await getTestToken('client@brandcorp.com')) }
    }).then(r => r.json());

    const clientCreatorSample = clientResponse.influencers[0];
    assert(clientCreatorSample.phone.includes('REDACTED'), 'Client role phone number is masked with REDACTED');

    const proposals = db.get('proposals');
    assert(proposals.length >= 1, `Found ${proposals.length} proposal in database`);

    const campaigns = db.get('campaigns');
    assert(campaigns.length >= 1, `Found ${campaigns.length} active campaigns`);

    console.log(`\n========================================`);
    console.log(`🎯 Test Summary: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

async function getTestToken(email) {
  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'admin123' })
  }).then(r => r.json());
  return res.token;
}

runTests();
