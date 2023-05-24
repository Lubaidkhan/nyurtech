const express = require('express');
const router = express.Router();

const VerifyToken = require('../middleware/VerifyToken');

const AuthRoute = require('./Auth.route');
const UserRoute = require('./User.route');


try {
    router.use('/auth', AuthRoute);
     router.use('/users',VerifyToken, UserRoute);
} catch (e) {
    throw e;

}

module.exports = router;
