// middlewares/auth.js

import jwt from 'jsonwebtoken';
const { verify } = jwt;

import User from '../models/User.js'; // ✅ default export

// Middleware kiểm tra JWT token
export async function protect(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: 'No token provided' });

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id); // ✅ dùng User model
    if (!req.user) return res.status(401).json({ msg: 'User not found' });

    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid or expired token' });
  }
}

// Middleware giới hạn truy cập theo quyền (ví dụ: chỉ manager)
export function managerOnly(req, res, next) {
  if (!req.user || req.user.role !== 'manager') {
    return res.status(403).json({ msg: 'Access denied' });
  }
  next();
}
