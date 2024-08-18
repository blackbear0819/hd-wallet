const express = require("express");
const router = express.Router();

const { login, register, getAllUsers, createAccount, loadAccounts, sendTransaction, checkBalance } = require("../controllers/main");
const authMiddleware = require('../middleware/auth')

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/users").get(getAllUsers);
router.route("/account").post(authMiddleware, createAccount);
router.route("/accounts").get(authMiddleware, loadAccounts);
router.route("/send-transaction").post(authMiddleware, sendTransaction);
router.route("/balance").post(authMiddleware, checkBalance);

module.exports = router;