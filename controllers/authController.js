import jwt from 'jsonwebtoken';
const { sign } = jwt;

import { hash, compare } from 'bcryptjs';
import User from '../models/User.js';

export async function register(req, res) {
  const { name, email, password } = req.body;
  const hashed = await hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  res.json(user);
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await compare(password, user.password)))
    return res.status(401).json({ msg: 'Invalid credentials' });

  const token = sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user });
}
