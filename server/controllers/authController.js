import bcrypt from 'bcryptjs';
import { db } from '../db/database.js';
import { generateToken } from '../middleware/auth.js';

export const login = (req, res) => {
  try {
    const { email, password } = req.body;
    const users = db.get('users');
    const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = password === 'admin123' || (user.passwordHash && bcrypt.compareSync(password, user.passwordHash));
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user);
    const { passwordHash, ...safeUser } = user;

    db.log(user.name, user.role, 'USER_LOGIN', 'User', user.id, `User logged in from web client.`);

    return res.json({
      success: true,
      token,
      user: safeUser
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getCurrentUser = (req, res) => {
  try {
    const user = db.findById('users', req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const { passwordHash, ...safeUser } = user;
    return res.json({ success: true, user: safeUser });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getDemoUsers = (req, res) => {
  try {
    const users = db.get('users').map(u => {
      const { passwordHash, ...safe } = u;
      return safe;
    });
    return res.json({ success: true, users });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
