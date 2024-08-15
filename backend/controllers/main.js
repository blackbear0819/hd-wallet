const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Account = require("../models/Account");
const { ethers } = require("ethers");

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      msg: "Bad request. Please add username and password in the request body",
    });
  }

  let foundUser = await User.findOne({ username: req.body.username });
  if (foundUser) {
    const isMatch = await foundUser.comparePassword(password);

    if (isMatch) {
      const token = jwt.sign(
        { id: foundUser._id, username: foundUser.username },
        process.env.JWT_SECRET,
        {
          expiresIn: 60 * 60 * 24 * 30,
        }
      );

      return res.status(200).json({ msg: "user logged in", token });
    } else {
      return res.status(400).json({ msg: "Bad password" });
    }
  } else {
    return res.status(400).json({ msg: "Bad credentails" });
  }
};

const getAllUsers = async (req, res) => {
  let users = await User.find({});

  return res.status(200).json({ users });
};

const register = async (req, res) => {
  let foundUser = await User.findOne({ username: req.body.username });
  if (foundUser === null) {
    let { username, password } = req.body;
    if (username.length && password.length) {
      const person = new User({
        username: username,
        // email: email,
        password: password,
      });
      await person.save();
      return res.status(201).json({ person });
    } else {
      return res.status(400).json({ msg: "Please add all values in the request body" });
    }
  } else {
    return res.status(400).json({ msg: "Username already in use" });
  }
};

const createAccount = async (req, res) => {
  const { account, privateKey } = req.body;
  try {
    // Create a Wallet instance using the private key
    const wallet = new ethers.Wallet(privateKey);
    // Get the public key
    const publicKey = wallet.address;
    try {
      await Account.create({ name: account, publicKey: publicKey });
      res.status(201).json({ msg: 'Your new account has been successfully created!' });
    } catch (error) {
      if (error.message.includes('duplicate key error')) {
        return res.status(400).send({ msg: `The account "${account}" is already in use.` });
      }
      res.status(400).json({ msg: error.message });
    }
  } catch (error) {
    if (error.message.includes('invalid private key')) {
      return res.status(400).send({ msg: `The private key "${privateKey}" is invalid.` });
    }
    res.status(400).json({ msg: error.message });
  }
}

const loadAccounts = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.status(200).json({ accounts: accounts });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

module.exports = {
  login,
  register,
  getAllUsers,
  createAccount,
  loadAccounts
};
