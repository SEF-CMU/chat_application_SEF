import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync';
import User from '../models/userModel';

const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization
    && req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const { authorization } = req.headers;
      // eslint-disable-next-line prefer-destructuring
      token = authorization.split(' ')[1];

      // decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export default protect;
