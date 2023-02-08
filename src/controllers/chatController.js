/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */

import Chat from '../models/chatModel';
import User from '../models/userModel';

/**
 * function to create chats
 * @param {*request} req
 * @param {*response} res
 * @returns chat object
 */
export const createChats = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({
      status: 400,
      error: 'User id is required',
    });
  }

  let isChat = await Chat.findOne({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage');

  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'name pic email',
  });

  if (isChat?.length > 0) {
    res.send(isChat[0]);
  } else {
    const newChat = new Chat({
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    });
    try {
      const savedChat = await Chat.create(newChat);

      const fullChat = await Chat.findOne({ _id: savedChat._id }).populate(
        'users',
        '-password',
      );
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};

/**
 * Function to get all chats
 * @param {*request} req
 * @param {*response} res
 */
export const getAllChats = async (req, res) => {
  try {
    Chat.findOne({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: 'latestMessage.sender',
          select: 'name pic email',
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

/**
 * function to create a group
 * @param {*request} req
 * @param {*response} res
 */

export const createGroup = async (req, res) => {
  const { name } = req.body;
  let { users } = req.body;
  if (!users || !name) {
    res.status(400).send({ message: 'Users and name are required' });
  }
  users = JSON.parse(users);
  if (users.length < 2) {
    return res.status(400).send({ message: 'At least 2 users are required' });
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: name,
      users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');
    res.status(200).send(fullChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

/**
 * Function to add user to a group
 * @param {*request} req
 * @param {*response} res
 */

export const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    },
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!added) {
    res.status(404).send({ message: 'Chat not found' });
  } else {
    res.json(added);
  }
};

/**
 * Function to remove user from group
 * @param {*request} req
 * @param {*response} res
 */

export const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    },
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!removed) {
    res.status(404).send({ message: 'Chat Not Found' });
  } else {
    res.json(removed);
  }
};
