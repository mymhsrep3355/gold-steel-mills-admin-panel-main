const { Schema, model } = require('mongoose');

const supplierSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  paymentReceived: {
    type: Number,
    default: 0,
    required: false,
  },
  paymentSent: {
    type: Number,
    default: 0,
    required: false,
  },
  advance: { //reprensents the amount paid in advance
    type: Number,
    default: 0,
    required: false,
  },
  balance:{  //Represents the amount due
    type: Number,
    default: 0,
    required: false,
  }


});

module.exports = model('Supplier', supplierSchema);