/**
 * Railway API Integration Verification Script
 * 
 * Copy and paste this entire script into your browser console
 * on the deployed frontend: https://new-frontend-lac-alpha.vercel.app
 * 
 * This will run all verification tests and report results.
 */

(async function verifyRailwayAPI() {
  console.log('🔍 Starting Railway API Verification...\n');
  
  const API_URL = 'https://apibackend-production-696e.up.railway.app';
  const FRONTEND_URL = 'https://new-frontend-lac-alpha.vercel.app';
  
  // Test 1: Environment Variable Check
  console.log('📋 Test 1: Environment Variable Check');
  console.log('─'.repeat(50));
  const envVar = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (envVar) {
    console.log('✅ Environment variable found:', envVar);
    if (envVar === API_URL) {
      console.log('✅ Environment variable matches Railway URL');
    } else {
      console.warn('⚠️ Environment variable does not match expected Railway URL');
      console.log('   Expected:', API_URL);
      console.log('   Found:', envVar);
    }
  } else {
    console.error('❌ Environment variable NEXT_PUBLIC_BACKEND_URL is undefined!');
    console.error('   Action Required:');
    console.error('   1. Check Vercel Settings → Environment Variables');
    console.error('   2. Add NEXT_PUBLIC_BACKEND_URL with value:', API_URL);
    console.error('   3. Redeploy the frontend');
  }
  console.log('');
  
  // Test 2: API Health Check
  console.log('📋 Test 2: API Health Check');
  console.log('─'.repeat(50));
  try {
    const healthResponse = await fetch(`${API_URL}/health`);
    const healthData = await healthResponse.json();
    
    if (healthResponse.ok && healthData.status === 'ok') {
      console.log('✅ API Health Check: PASSED');
      console.log('   Response:', healthData);
      if (healthData.checks?.database === 'ok') {
        console.log('✅ Database connection: OK');
      } else {
        console.warn('⚠️ Database check:', healthData.checks?.database);
      }
    } else {
      console.error('❌ API Health Check: FAILED');
      console.error('   Status:', healthResponse.status);
      console.error('   Response:', healthData);
    }
  } catch (error) {
    console.error('❌ API Health Check: ERROR');
    console.error('   Error:', error.message);
    console.error('   This could indicate:');
    console.error('   - API is down');
    console.error('   - Network connectivity issue');
    console.error('   - CORS configuration problem');
  }
  console.log('');
  
  // Test 3: Properties Endpoint
  console.log('📋 Test 3: Properties Endpoint');
  console.log('─'.repeat(50));
  try {
    const propertiesResponse = await fetch(`${API_URL}/api/properties?page=1&pageSize=5`);
    const propertiesData = await propertiesResponse.json();
    
    if (propertiesResponse.ok) {
      console.log('✅ Properties Endpoint: PASSED');
      console.log('   Status:', propertiesResponse.status);
      console.log('   Properties count:', propertiesData.properties?.length || 0);
      console.log('   Total:', propertiesData.total || 0);
      
      if (propertiesData.properties && propertiesData.properties.length > 0) {
        console.log('✅ Real data received!');
        const firstProperty = propertiesData.properties[0];
        console.log('   First property sample:', {
          listingKey: firstProperty.listingKey,
          address: firstProperty.FullAddress || firstProperty.address?.street,
          price: firstProperty.ListPrice || firstProperty.price,
        });
        
        // Check if it's real data (not mock)
        if (firstProperty.listingKey || firstProperty.id) {
          console.log('✅ Data structure looks correct');
        }
      } else {
        console.warn('⚠️ No properties returned - API may be empty or endpoint issue');
      }
    } else {
      console.error('❌ Properties Endpoint: FAILED');
      console.error('   Status:', propertiesResponse.status);
      console.error('   Response:', propertiesData);
    }
  } catch (error) {
    console.error('❌ Properties Endpoint: ERROR');
    console.error('   Error:', error.message);
  }
  console.log('');
  
  // Test 4: Network Tab Instructions
  console.log('📋 Test 4: Network Tab Verification');
  console.log('─'.repeat(50));
  console.log('📝 Manual Check Required:');
  console.log('   1. Open Developer Tools (F12) → Network tab');
  console.log('   2. Clear network log (trash icon)');
  console.log('   3. Reload the page (F5)');
  console.log('   4. Filter by "Fetch/XHR" or search for "api"');
  console.log('   5. Look for requests to:', API_URL);
  console.log('');
  console.log('   ✅ Expected:');
  console.log('      - Requests to Railway URL');
  console.log('      - Status codes: 200 (OK)');
  console.log('      - Response data: Real property objects');
  console.log('');
  console.log('   ❌ Problems:');
  console.log('      - Requests to localhost:8080 → Need to redeploy');
  console.log('      - No API requests → Using mock data fallback');
  console.log('      - Status 404 → Wrong endpoint');
  console.log('      - Status 500 → API error (check Railway logs)');
  console.log('      - CORS errors → CORS configuration issue');
  console.log('');
  
  // Summary
  console.log('📊 Verification Summary');
  console.log('═'.repeat(50));
  console.log('✅ Configuration: Check environment variable above');
  console.log('✅ API Health: Check Test 2 results above');
  console.log('✅ Properties: Check Test 3 results above');
  console.log('✅ Network: Perform manual check (Test 4)');
  console.log('');
  console.log('🎯 Next Steps:');
  console.log('   1. If environment variable is undefined → Add to Vercel and redeploy');
  console.log('   2. If API tests fail → Check Railway API status');
  console.log('   3. If Network tab shows localhost → Redeploy frontend');
  console.log('   4. If Network tab shows no API calls → Check frontend code');
  console.log('');
  console.log('✅ Verification complete!');
})();

