const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3050;
const EXTERNAL_API_BASE = 'https://worldcup26.ir/get/soccer';

app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'] }));
app.use(express.json({ limit: '1mb' }));

app.use(async (req, res) => {
  try {
    // Only allow GET requests to the proxy
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    // Restrict proxied path to a safe subset
    if (!/^\/[a-zA-Z0-9/_-]*$/.test(req.path)) {
      return res.status(400).json({ error: 'Invalid path' });
    }
    const url = `${EXTERNAL_API_BASE}${req.path}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;
    console.log(`Proxying: ${req.method} ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to proxy request' });
  }
});

app.listen(PORT, () => {
  console.log(`Local football API proxy running on http://localhost:${PORT}`);
  console.log(`Proxying to ${EXTERNAL_API_BASE}`);
});
EOF