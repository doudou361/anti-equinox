const http = require('http');

const data = JSON.stringify({
  formData: {
    fullName: "Imad",
    phone: "021555522",
    gender: "Homme",
    bloodGroup: "O+",
    birthdate: "07/26/2026"
  },
  planId: "mensuel-1",
  months: 1
});

const req = http.request({
  hostname: 'localhost',
  port: 5173,
  path: '/api/book',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
