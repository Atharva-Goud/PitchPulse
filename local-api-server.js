const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3050;
const EXTERNAL_API_BASE = 'https://worldcup26.ir/get/soccer';

app.use(cors());
app.use(express.json());

app.use(async (req, res) => {
  try {
    const url = `${EXTERNAL_API_BASE}${req.path}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;
    console.log(`Proxying: ${req.method} ${url}`);
    
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
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