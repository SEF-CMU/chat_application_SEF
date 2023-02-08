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
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name pic email')
      .populate('chat');
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
    console.log('Invalid data passed into request');
    return res.sendStatus(400);
  }

  const newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate('sender', 'name pic');
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name pic email',
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
