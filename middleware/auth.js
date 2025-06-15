import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import BoardUser from '../models/BoardUser.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Verify JWT token middleware
export const authenticateUser = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId).select('-password -refreshToken');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Check if user is admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

// Check if user has access to board
export const checkBoardAccess = (requiredRole = 'viewer') => {
  return async (req, res, next) => {
    try {
      const { boardId } = req.params;
      const userId = req.user._id;
      
      // Get user's role for this board
      const boardUser = await BoardUser.findOne({ boardId, userId });
      
      // Define role hierarchy (higher number = more privileges)
      const roleHierarchy = {
        'viewer': 1,
        'editor': 2,
        'owner': 3
      };
      
      // Check if user has required role or higher
      if (boardUser && roleHierarchy[boardUser.role] >= roleHierarchy[requiredRole]) {
        // Add board role to request for further use
        req.boardRole = boardUser.role;
        next();
      } else {
        res.status(403).json({ message: `Insufficient permissions: ${requiredRole} role required` });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};