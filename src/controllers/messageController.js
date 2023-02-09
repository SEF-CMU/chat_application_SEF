/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
import Message from '../models/messageModel';
import User from '../models/userModel';
import Chat from '../models/chatModel';

/**
 * @description retrieve all messages
 * @param {request} req
 * @param {*response} res
 * @return json object all all messages
 */
export const allMessages = async (req, res) => {
  try {
    let messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name pic email')
      .populate('chat');

    messages = await User.populate(messages, {
      path: 'chat.users',
      select: 'name pic email',
    });

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

/**
 * @description send a message
 * @param {request} req
 * @param {*response} res
 * @return json object of created message
 */

export const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res
      .status(400)
      .send({ message: 'Invalid data passed into request' });
  }

  const newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  try {
    const message = await Message.create(newMessage);

    let fullMessage = await Message.findOne({ _id: message._id })
      .populate('sender', 'name pic')
      .populate('chat');

    fullMessage = await User.populate(fullMessage, {
      path: 'chat.users',
      select: 'name pic email',
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: fullMessage });
    res.send(fullMessage);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
