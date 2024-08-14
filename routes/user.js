const express = require("express");
const router = express.Router();

const { login, register, getAllUsers, createAccount, loadAccounts } = require("../controllers/main");
const authMiddleware = require('../middleware/auth')

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/users").get(getAllUsers);
router.route("/account").post(authMiddleware, createAccount);
router.route("/accounts").get(authMiddleware, loadAccounts);

module.exports = router;