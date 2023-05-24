const mongoose = require('mongoose');
const sendEmail = require("../middleware/sendEmail");

const User = require('../models/User.model');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const asyncWrapper = require('../middleware/asyncWrapper');
const { createCustomError } = require('../errors/custom-error');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

module.exports = {

  signUpUser: asyncWrapper(async (req, res, next) => {
    let errorArray = [];

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      errorArray.push("Email already exists");
      next(createCustomError(errorArray, 400, false));
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    const result = await newUser.save();

    // const { password: _, _id, ...responseData } = result._doc;

    res.status(201).send({ message: 'User Registered successfully!' ,user: result});
  }),

  loginUser: asyncWrapper(async (req, res, next) => {

    let errorArray = [];
    console.log('req.body', req.body)
    const email = req.body.email;
    const user = await User.findOne({ email: email, is_deleted: false });
    if (!user) {
      errorArray.push("Email Id is not valid")
      next(createCustomError(errorArray, 404, false, 'yes'))
      return;
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      errorArray.push("Password is not correct")
      next(createCustomError(errorArray, 404, false, 'yes'))
      return;
    }

    var token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_LIFETIME
    });
    console.log(token)
    res.send({ 'status': true, 'token': token, 'user': user });
  }),

  googleloginUser: asyncWrapper(async (req, res, next) => {
    let errorArray = [];
    let googleEmail;
    console.log(req.body)
    const gtoken = req.body.token;
    console.log(req.body.token)
    const ticket = await client.verifyIdToken({
      idToken: gtoken,
      audience: process.env.CLIENT_ID,
    });
    console.log("ticket======", ticket)
    const payload = ticket.getPayload();
    console.log("payload", payload.email)
    googleEmail = payload.email


    const user = await User.findOne({ email: googleEmail, is_deleted: false });
    console.log("user", user)
    if (!user) {
      errorArray.push("Email Id is not valid")
      next(createCustomError(errorArray, 404, false))
      return;
    }

    var token = jwt.sign({ id: user._id, email: user.email, name: user.username, }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_LIFETIME
    });

    res.send({ 'status': true, 'token': token, 'user': user });

  }),

  forgotPassword: asyncWrapper(async (req, res, next) => {
    let errorArray = [];
    const { email } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      errorArray.push("Email is not valid!!")
      next(createCustomError(errorArray, 404, false));
      return;
    }

    const secret = process.env.JWT_SECRET
    const token = jwt.sign({ email: user.email, id: user._id }, secret, {
      expiresIn: "15m",
    });
    const link = `http://localhost:3000/reset-password/${user._id}/${token}`;

    await sendEmail(user?.email, "Password reset", link);

    res.status(200).send({ message: "password reset link sent to your email account & check in console as well for test" });

    console.log(link);

  }),

  postResetPassword: asyncWrapper(async (req, res, next) => {

    let errorArray = [];
    const { id, token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ _id: mongoose.Types.ObjectId(id) });
    if (!user) {
      errorArray.push("Invalid User Id");
      next(createCustomError(errorArray, 404, false));
      return;
    }
    if (!token) {

      return res.status(401).send('Access Denied !');
    }
    const secret = process.env.JWT_SECRET

    jwt.verify(token, secret, process.env.JWT_LIFETIME, function (err, resp) {
      if (err) {
        errorArray.push("Invalid Token");

      }
    });
    if (errorArray.length) {
      next(createCustomError(errorArray, 403, false));
      return;
    }
    else {

      const encryptedPassword = await bcrypt.hash(password, 10);
      await User.updateOne(
        {
          _id: mongoose.Types.ObjectId(id),
        },
        {
          $set: {
            password: encryptedPassword,
          },
        }
      );
      res.json({ status: "Password updated" });
    }
  })
}
