import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return res.status(403).json({ error: 'Invalid token payload: missing user id' });
    }

    req.user = { id: decoded.id }; 
    next();
  } catch (err) {
    console.error('❌ Token error:', err.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export default verifyToken;
