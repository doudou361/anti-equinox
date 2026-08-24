// Simple test server that catches all errors and prints them to the browser
const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Server is alive!</h1><p>If you see this, the basic Node.js server is working on Octenium.</p>');
});

server.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
