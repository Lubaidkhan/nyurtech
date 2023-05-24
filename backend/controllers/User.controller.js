const mongoose = require('mongoose');
const moment = require('moment');
const User = require('../models/User.model');
const asyncWrapper = require('../middleware/asyncWrapper');
const { createCustomError } = require('../errors/custom-error');


module.exports = {
 
  getAllUsers: asyncWrapper(async (req, res, next) => {
    const { length, page } = req.body;
    const errorArray = [];
  
    function validateParam(value, paramName, errorMessage) {
      if (typeof value === "undefined") {
        errorArray.push(`${paramName} is required`);
      } else if (value <= 0) {
        errorArray.push(errorMessage);
      }
    }
  
    validateParam(length, "length", "Length should be greater than zero");
    validateParam(page, "page", "Page should be greater than zero");
  
    if (errorArray.length > 0) {
      return next(createCustomError(errorArray, 404, false, 'no'));
    }
  
    const query = { is_deleted: false };
    const totalCount = await User.find(query).count(query);
    const users = await User.find(query).sort({ _id: 1 }).limit(length).skip((page - 1) * length);
  
    if (users.length === 0) {
      errorArray.push('No User Found');
      return next(createCustomError(errorArray, 404, false));
    }
  
    const result = {
      records: users,
      totalCount: totalCount
    };
  
    res.status(200).send({ message: 'Users fetched successfully', result });
  }),  

  findUserById: asyncWrapper(async (req, res, next) => {
    let errorArray = [];
    const filter = { is_deleted: false, _id: mongoose.Types.ObjectId(req.params.id) }

    const user = await User.aggregate([
      {
        $match: filter
      },
    ]);

    if (!user.length) {
      errorArray.push('No User found with this id')
      next(createCustomError(errorArray, 404, false, 'no'));
      return;
    }

    res.status(200).send({ message: "result", user });

  }),

  updateAUser: asyncWrapper(async (req, res, next) => {
    let errorArray = [];
    console.log('update:req.body', req.body);

    const filter = { _id: mongoose.Types.ObjectId(req.params.id) };
    const updates = req.body;
    updates.updatedAt = moment().format('DD-MM-YYYY HH:mm:SS')

    console.log(req.body)
    const result = await User.findByIdAndUpdate(filter, updates, { new: true });

    if (!result) {
      errorArray.push('No User found for update with this id')
      next(createCustomError(errorArray, 404, false, 'no'));
      return;
    }

    res.status(200).send({ message: "User Updated Successfully", result });

  }),

  deleteAUser: asyncWrapper(async (req, res, next) => {
    let errorArray = [];
    const filter = { _id: mongoose.Types.ObjectId(req.params.id) };
    const update = { is_deleted: true };
    update.updatedAt = moment().format('DD-MM-YYYY HH:mm:SS')


    const result = await User.findByIdAndUpdate(filter, update, { new: true });

    if (!result) {
      errorArray.push('Can not delete user with id')
      next(createCustomError(errorArray, 404, false, 'no'));
      return;
    }

    res.send({ message: "User Deleted successfully", result });
    console.log('update:req.body', req.body);
  }),

};
