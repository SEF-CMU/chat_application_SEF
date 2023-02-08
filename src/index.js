import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import io from 'socket.io';
import userRoutes from './routes/userRoutes';
import chatRoutes from './routes/chatRoutes';

const app = express();
app.use(express.json());
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

app.use('/api/v1/users', cors(), userRoutes);
app.use('/api/v1/chats', cors(), chatRoutes);

const PORT = process.env.PORT || 5000;

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
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log(`User Joined Room: ${room}`);
  });

  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));
});
