const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/Auth.controller');

//Register a User
router.post('/register', AuthController.signUpUser);

//Login user
router.post('/login', AuthController.loginUser);

router.post('/googlelogin', AuthController.googleloginUser);

// forgot password
router.post('/forgot-password', AuthController.forgotPassword);

// reset password

router.post('/reset-password/:id/:token',AuthController.postResetPassword);

module.exports = router;