import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'manager', 'admin'], default: 'user' },
  googleId: String,
});

export default model('User', userSchema);
