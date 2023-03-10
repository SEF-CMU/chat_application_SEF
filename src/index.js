/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import io from 'socket.io';
import userRoutes from './routes/userRoutes';
import chatRoutes from './routes/chatRoutes';
import messageRoutes from './routes/messageRoutes';
import dbConnection from './config/config';

const app = express();
app.use(express.json());
dotenv.config({ path: './config.env' });

dbConnection();
app.use(cors());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/chats', chatRoutes);
app.use('/api/v1/messages', messageRoutes);

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, console.log(`Server Started on Port ${PORT}`));
const socketIo = io(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000',
  },
});

socketIo.on('connection', (socket) => {
  console.log('Connected to socket.io');
  socket.on('setup', (userData) => {
    // eslint-disable-next-line no-underscore-dangle
    socket.join(userData.id);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log(`User Joined Room: ${room}`);
  });

  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  socket.on('new message', (newMessageRecieved) => {
    const { chat } = newMessageRecieved;

    if (!chat.users) return console.log('chat.users not defined');

    chat.users.forEach((user) => {
      if (user._id !== newMessageRecieved.sender._id) {
        socket.in(user._id).emit('message received', newMessageRecieved);
      }
    });
  });

  socket.off('setup', () => {
    console.log('USER DISCONNECTED');
    socket.leave(userData.id);
  });
});
