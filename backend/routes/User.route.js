const express = require('express');
const { getUserList } = require('../controllers/User.controller');
const router = express.Router();

const UserController = require('../controllers/User.controller');


//Get a list of all users
router.post('/list', UserController.getAllUsers);

//Get an user by id
router.get('/:id', UserController.findUserById);

//Update a user by id
router.patch('/:id', UserController.updateAUser);

//Delete a user by id
router.delete('/:id', UserController.deleteAUser);


module.exports = router;