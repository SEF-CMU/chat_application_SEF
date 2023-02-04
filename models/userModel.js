const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
    length: [3, 'A user name must have more or equal then 3 characters'],
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: [3, 'A password must have more or equal then 3 characters'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This is used only on CREATE and SAVE!!!
      validator(el) {
        return el === this.password;
      },
    },
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
