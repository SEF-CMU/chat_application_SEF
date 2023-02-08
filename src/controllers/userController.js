/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */
import catchAsync from '../utils/catchAsync';
import User from '../models/userModel';

export const allUsers = catchAsync(async (req, res) => {
  const keyword = req.query.search
    ? {
      $or: [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ],
    }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});
