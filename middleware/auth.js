
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // Load from .env

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret'; // Fallback

module.exports = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      const data = jwt.verify(token, JWT_SECRET);

      if (roles.length && !roles.includes(data.role)) {
        return res.status(403).json({ error: 'Forbidden: Insufficient role' });
      }

      req.user = data;
      next();
    } catch (err) {
      console.error('Auth error:', err.message);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
};
