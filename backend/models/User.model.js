const moment = require('moment');
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {

    type: String,
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please add a valid email address.',
      ],
      // required: [true, 'Please enter Email Address'],
      lowercase: true,
      //immutable: true

  },

  password: {
    type: String,
    minLength: 6
  },

  createdAt: {
    type:String,
    default:moment().format('MMMM Do YYYY, h:mm:ss a'),
    immutable: true
  },

  updatedAt: {
    type: String
  },

  is_deleted: {
    type: Boolean,
    default: false
  },

});

const User = mongoose.model('user', UserSchema);
module.exports = User;