const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Account = require("../models/Account");
const { ethers, Wallet } = require("ethers");
const axios = require('axios');
// const Web3 = require('web3');

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
      const userId = (await User.findOne({ username: username }))._id;
      const account = new Account({
        name: 'Account1',
        publicKey: wallet.address,
        privateKey: wallet.privateKey,
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
  const { fromAccount, toAccount, amount, token } = req.body;
  if (token === 'ethereum') {
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

  if (token === 'optimism') {
    const provider = new ethers.providers.InfuraProvider('optimism', process.env.INFURA_API_KEY);
    const wallet = new ethers.Wallet(fromAccount, provider);
    
    const tx = {
      to: toAccount, // The address you want to send ETH to
      value: ethers.utils.parseEther(amount), // Amount of ETH to send
      gasLimit: 200000, // Customize gas limit
      gasPrice: ethers.utils.parseUnits('10', 'gwei'), // Set a gas price
    };

    try {
      const transactionResponse = await wallet.sendTransaction(tx);

      // Wait for the transaction to be mined
      const receipt = await transactionResponse.wait();
      return res.status(200).json({result: 'Transaction successful with hash:' + receipt.transactionHash})
      // console.log('Transaction successful with hash:', receipt.transactionHash);
    } catch (error) {
      return res.status(400).json(error)
    }
  }
}

const checkBalance = async (req, res) => {
  try {
    // Replace with your Ethereum address
    const address = req.body.address;

    const ethProvider = new ethers.providers.InfuraProvider("mainnet", process.env.INFURA_API_KEY);

    // Get Ethereum balance
    const ethBalance = await ethProvider.getBalance(address);
    const ethResponse = await axios.get('https://api-pub.bitfinex.com/v2/ticker/tETHUSD');
    const ethUsd = ethResponse.data[6];

    const optimismNodeUrl = 'https://mainnet.optimism.io'; // or your node provider URL
    const provider = new ethers.providers.JsonRpcProvider(optimismNodeUrl);

    const balance = await provider.getBalance(address);
    const optBalance = ethers.utils.formatEther(balance);

    const optResponse = await await axios.get('https://min-api.cryptocompare.com/data/price', {
      params: {
        fsym: 'OP',
        tsyms: 'USD'
      }
    });
    const optUsd = optResponse.data.USD;

    return res.status(200).json({
      ethBalance: ethers.utils.formatEther(ethBalance),
      ethUsd: ethUsd,
      optBalance: optBalance,
      optUsd: optUsd
    });
  } catch (error) {
    return res.status(400).json(error);
  }
}

const restoreWallet = async (req, res) => {
  const { seedPhrase } = req.body;
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