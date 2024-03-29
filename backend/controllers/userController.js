const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
// This import came from "jsonwebtoken": "^9.0.0" package which is used to communicate between frontend and backend
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
  // generating token
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
// using pakage to avoid using try catch while using async function
// Register user
const registerUser = asyncHandler(async (req, res) => {
  // Destructuring body
  const { name, email, password } = req.body;

  // Adding Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please do not submit empty fields");
  }
  if (password < 6) {
    res.status(400);
    throw new Error("**Password is Too Short**");
  }

  //Checking Existing USers

  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("Email already taken please choose another");
  }
  // Create new User

  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate Token
  const token = generateToken(user._id);

  // Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, name, email, photo, address, description } = user;
    res.status(201).json({
      _id,
      name,
      email,
      address,
      photo,
      description,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid Credentials");
  }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate Request

  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter credentials, This field cannot be empty");
  }

  // Checking if user exists or not

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not found ,Please signup first");
  }

  //  Checking paswword after existing user is found in the database
  // bcrypt also compares the data of the database and gives back the result
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  // If the info is correct then

  // Generate Token
  const token = generateToken(user._id);

  // Send HTTP-only cookie to the frontend
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true,
  });

  if (user && passwordIsCorrect) {
    const { _id, name, email, photo, address, description } = user;
    res.status(200).json({
      _id,
      name,
      email,
      address,
      photo,
      description,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid Credentials, Please try again");
  }
});

// Logout User

const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Logged Out Successfully" });
});

// Get User Data
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, name, email, photo, address, description } = user;
    res.status(200).json({
      _id,
      name,
      email,
      address,
      photo,
      description,
    });
  } else {
    res.status(400);
    throw new Error("User Not Found");
  }
});

// Get Login Status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json(false);
    // To check if the user is logged in we use a boolean data type to verify and if the user is logged in there will be token and return true otherwise false
  }
  // verifying if the token is there

  const verified = jwt.verify(token, process.env.JWT_SECRET);

  if (verified) {
    return res.json(true);
  } else {
    return res.json(false);
  }
});

// Update user
// this is used to change all the data from the user profile including , name password picture and bio

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, name, email, photo, address, description } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.address = req.body.address || address;
    user.photo = req.body.photo || photo;
    user.description = req.body.description || description;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      address: updatedUser.address,
      photo: updatedUser.photo,
      description: updatedUser.description,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});
// Changing Password

const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(400);
    throw new Error("User not found, please signup");
  }
  const { password, newPassword } = req.body;
  // Validating Password is correct or not

  if (!password || !newPassword) {
    res.status(400);
    throw new Error("Password field cannot be empty");
  }

  // Checking if the entered password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  //  Save new Password
  if (user && passwordIsCorrect) {
    user.password = newPassword;
    await user.save();
    res.status(200).json("Password Changed");
  } else {
    res.status(400);
    throw new Error("Entered Password is incorrect ");
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User does not exist");
  }
  // Delete token if it exists in DB
  let token = await Token.findOne({ userId: user._id });

  if (token) {
    await token.deleteOne();
  }

  // Create Reset TOken
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(resetToken);

  // Hashing Token before saving to DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Save TOken to Database
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresIn: Date.now() + 60 * (60 * 1000), // One Hour
  }).save();

  // Constructing Reset Url
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  // Reset Email
  const message = `
  <h2>Hello ${user.name}</h2>
  <p>Please use the url below to reset your password</p>
  <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
  <p>This reset link is only valid for 1hour</p>
  <p>Thank you</p>
  `;

  const subject = "Password Reset Request";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, sent_from);
    res.status(200).json({ success: true, message: "Reset Email Sent" });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again");
  }
});

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  //  Hash token , then compare to Token in database
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Find token in DB

  const userToken = await Token.findOne({
    token: hashedToken,
    expiresIn: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invaid or Expired Token");
  }

  // Find User
  const user = await User.findOne({ _id: userToken.userId });
  user.password = password;
  await user.save();
  res.status(200).json({
    message: "Password Reset Successful, Please Login",
  });
});

module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
};
