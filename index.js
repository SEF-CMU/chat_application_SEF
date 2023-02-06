import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRoutes';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/v1/users', userRouter);

dotenv.config({ path: './config.env' });

// update the password in db connection string
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// Connecting to the database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!'));
const port = process.env.PORT || 5000;
app.listen(port, () => {
  process.stdout.write(`Now listening on port ${port}`);
});
