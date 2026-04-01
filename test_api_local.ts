
async function testApi() {
  try {
    const res = await fetch('http://localhost:3000/api/health');
    const data = await res.json();
    console.log('API Health Check:', data);
  } catch (err) {
    console.error('API Health Check Failed:', err);
  }
}

testApi();
