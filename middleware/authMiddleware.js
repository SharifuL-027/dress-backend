import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// 1. Token Verify Korar Middleware (Customer & Admin ubhoyeri jonno)
export const protect = async (req, res, next) => {
  let token;

  // HTTP-Only Cookie theke token nibe
  token = req.cookies.jwt;

  if (token) {
    try {
      // Token decode kore userId ber kora
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // req.user er vitore user er database theke asha data set kore dilam (password chara)
      req.user = await User.findById(decoded.userId).select('-password');
      next(); // Sob thik thakle porer kaje jete dibe
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// 2. Admin Verify Korar Middleware (Shudhu Admin er jonno)
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // Admin holei porer kaje (jemon product add/delete) jete dibe
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};