import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user and exclude the password field
    const user = await User.findById(decoded._id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Attach the user object to the req object
    req.user = user;
    next();
  } catch (error) {
    console.error('Error in requireAuth middleware:', error);
    res.status(401).json({ error: 'Request is not authorized' });
  }
};

export default requireAuth;
