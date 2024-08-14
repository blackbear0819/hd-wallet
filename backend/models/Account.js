const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name field is required!'],
    minlength: 3,
    maxlength: 50
  },
  publicKey: {
    type: String,
    required: [true, 'public key field is required!'],
    minlength: 3,
    maxlength: 50
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("Account", AccountSchema);