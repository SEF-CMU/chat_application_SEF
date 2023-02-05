import jwt from "jsonwebtoken";
import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // Create a token and send it to the client
  const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: "success",
    message: "user created successfully",
    // token: token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {

  const user = User.findOne({ email: req.body.email });

  if (!user) { return next(new AppError("Email doesn't exist", 401)); }

  const isPasswordCorrect = await user.correctPassword(req.body.password, user.password);

  if (!isPasswordCorrect) { return next(new AppError("Incorrect password", 401)); }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {  
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    status: "success",
    message: "user logged in successfully",
    // token: token,
    data: {
      user: user,
    },
    
  });

  
});