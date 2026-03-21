const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

      const userResult = await pool.query(
        'SELECT id, username, email, role, is_member, google_id FROM users WHERE id = $1', 
        [decoded.id]
      );

      if (userResult.rows.length === 0) {
        return res.status(401).json({ error: 'User no longer exists' });
      }

      req.user = userResult.rows[0];
      return next();

    } catch (error) {
      console.error('Auth Error:', error.message);
      const message = error.message === 'jwt expired' 
        ? 'Session expired, please login again' 
        : 'Not authorized, token failed';
      return res.status(401).json({ error: message });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token found' });
  }
};

module.exports = { protect };