const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Account = require("../models/Account");
const { ethers, Wallet } = require("ethers");
const axios = require('axios');

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
      const wallet = ethers.Wallet.createRandom();
      const person = new User({
        username: username,
        password: password,
        seedPhrase: wallet.mnemonic.phrase,
        address: wallet.address,
        privateKey: wallet.privateKey
      });
      await person.save();
      const userId = (await User.findOne({username: username}))._id;
      const account = new Account({
        name: 'Account1',
        publicKey: wallet.address,
        privateKey: wallet.publicKey,
        userId: userId
      });
      await account.save();
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
  const { id } = req.user;
  // private key example : 0x4c0883a69102937d6238479f8b59b3a2a3f254dcb3c0b1c3e8c25b279d9f7c74
  try {
    // Create a Wallet instance using the private key
    const wallet = new ethers.Wallet(privateKey);
    // Get the public key
    const publicKey = wallet.address;
    const accounts = await Account.find();
    for (let index = 0; index < accounts.length; index++) {
      if (accounts[index].publicKey === publicKey) {
        return res.status(400).send({ msg: `The private key "${privateKey}" is already in use.` });
      }
    }
    try {
      await Account.create({ name: account, publicKey, privateKey, userId: id });
      res.status(201).json({ msg: 'Your new account has been successfully created!' });
    } catch (error) {
      if (error.message.includes('duplicate key error')) {
        return res.status(400).send({ msg: `The account "${account}" is already in use.` });
      }
      res.status(400).json({ msg: error.message });
    }
  } catch (error) {
    if (error.message.includes('invalid')) {
      return res.status(400).send({ msg: `The private key "${privateKey}" is invalid.` });
    }
    res.status(400).json({ msg: error.message });
  }
}

const loadAccounts = async (req, res) => {
  const { id, username } = req.user;
  try {
    const accounts = await Account.find({ userId: id });
    res.status(200).json({ accounts: accounts, username });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

const sendTransaction = async (req, res) => {
  const { fromAccount, toAccount, amount } = req.body;
  const providerUrl = `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`; // Use your own provider
  try {
    // Connect to an Ethereum provider
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    // Create a wallet instance
    const wallet = new ethers.Wallet(fromAccount, provider);
    // Get the current nonce for the wallet
    const nonce = await wallet.getTransactionCount();
    // Create the transaction
    const tx = {
      to: toAccount,
      value: ethers.utils.parseEther(amount), // Amount in Ether
      nonce: nonce,
      gasLimit: 21000, // Gas limit
      gasPrice: ethers.utils.parseUnits('50', 'gwei') // Set gas price
    };
    // Send the transaction
    const txResponse = await wallet.sendTransaction(tx);
    console.log(`Transaction hash: ${txResponse.hash}`);
    // Wait for the transaction to be confirmed
    const receipt = await txResponse.wait();
    console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
  } catch (error) {
    return res.status(400).json(error);
  }
}

const checkBalance = async (req, res) => {
  const provider = new ethers.providers.InfuraProvider('mainnet', process.env.INFURA_API_KEY);
  try {
    const balance = await provider.getBalance(req.body.address);
    const balanceInEth = ethers.utils.formatEther(balance);
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const price = response.data.ethereum.usd;
    res.status(200).json({
      balance: balanceInEth,
      usd: price * parseFloat(balanceInEth)
    });
  } catch (error) {
    res.status(500).json(error);
  }
}

const restoreWallet = async (req, res) => {
  const { seedPhrase } = req.body;
  // const seedPhrase = 'beach mind mix fury key gallery ill elite spin gold betray trouble';
  try {
    // Create a wallet from the seed phrase
    const wallet = Wallet.fromMnemonic(seedPhrase);
    const publicKey = (await User.findById(req.user.id)).address;
    // You can retrieve wallet address for further actions
    const address = wallet.address;
    if (publicKey === address) {
      // Here you can also fetch the user's balance from a node or check against your database  
      return res.status(200).json({ message: "Wallet Restored", address });
    } else {
      return res.status(400).json({ message: "The seed phrase is incorrect!" });
    }
  } catch (error) {
    res.status(400).json({ message: "Failed to restore wallet" });
  }
}

const loadSeedPhrase = async (req, res) => {
  try {
    const seedPhrase = (await User.findById(req.user.id)).seedPhrase;
    return res.status(200).json({ seedPhrase: seedPhrase });
  } catch (error) {
    return res.status(400).json(error);
  }
}

module.exports = {
  login,
  register,
  getAllUsers,
  createAccount,
  loadAccounts,
  sendTransaction,
  checkBalance,
  restoreWallet,
  loadSeedPhrase
};