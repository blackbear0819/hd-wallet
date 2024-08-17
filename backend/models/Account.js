const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name field is required!'],
    minlength: 3,
    maxlength: 50,
    unique: true
  },
  publicKey: {
    type: String,
    required: [true, 'Public key field is required!'],
    unique: true
  },
  privateKey: {
    type: String,
    required: [true, 'Private key field is required!'],
    unique:true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Account", AccountSchema);