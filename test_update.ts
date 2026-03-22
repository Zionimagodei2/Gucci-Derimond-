async function run() {
  try {
    const res = await fetch('http://localhost:3000/api/products/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-access': 'true' },
      body: JSON.stringify({ is_featured: true })
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  }
}
run();
