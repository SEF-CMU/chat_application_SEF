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

export const findOneUser = async (req, res) => {
  const { id } = req.param;
  try {
    const user = await User.findById(id);
    if (user) {
      return res.status(200).send({
        id: user._id,
        name: user.name,
        email: user.email,
      });
    }
    return res.status(404).send({ message: 'User not found' });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};
