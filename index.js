import express from 'express';

const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send('Welcome to chat application');
});

app.listen(port, () => {
  process.stdout.write(`Now listening on port ${port}`);
});
