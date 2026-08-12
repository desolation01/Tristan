// Stateless HMAC-based CSRF tokens (works across serverless instances)
const crypto = require('crypto');
const csrfSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function generateCsrfToken() {
  const timestamp = Date.now().toString();
  const hmac = crypto.createHmac('sha256', csrfSecret).update(timestamp).digest('hex');
  return `${timestamp}.${hmac}`;
}

function validateCsrfToken(token) {
  try {
    if (!token || !token.includes('.')) return false;
    const [timestamp, hmac] = token.split('.');
    if (Date.now() - Number(timestamp) > 3600000) return false;
    const expected = crypto.createHmac('sha256', csrfSecret).update(timestamp).digest('hex');
    if (hmac.length !== expected.length) return false;
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expected));
  } catch {
    return false;
  }
}

// CORS headers
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
    'Content-Type': 'application/json'
  };
}

module.exports = async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Set CORS headers
  Object.entries(corsHeaders()).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  const action = req.query.action || '';

  try {
    // 0. FETCH CSRF TOKEN
    if (action === 'token' && req.method === 'GET') {
      const token = generateCsrfToken();
      return res.status(200).json({ token });
    }

    // 1. CONTACT FORM (Public)
    if (action === 'contact' && req.method === 'POST') {
      const { name, email, message } = req.body || {};

      // Basic validation
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email address.' });
      }

      // In a real app, you would save to database or send email
      // For now, just acknowledge receipt
      console.log('Contact form submission:', { name, email, message: message.substring(0, 100) });

      return res.status(200).json({
        ok: true,
        message: 'Thank you for your message! I will get back to you soon.'
      });
    }

    // Default response
    return res.status(400).json({ error: 'Invalid action or method' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};