import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { email, password, mobile, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, mobile: mobile || '', role: role || 'user' });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email }, 
      process.env.JWT_SECRET || 'secret_key', 
      { expiresIn: '1d' }
    );
    res.json({ token, user: { email: user.email, role: user.role, mobile: user.mobile || '' } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const changeRole = async (req, res) => {
  try {
    const { email, newRole } = req.body;
    const user = await User.findOneAndUpdate({ email }, { role: newRole }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `Role changed to ${newRole}`, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
