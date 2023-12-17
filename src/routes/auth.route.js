const { register, login, getUser } = require('../controllers/auth.controller')

const express = require('express');
const { verifyUser } = require('../middlewares/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', verifyUser, getUser);

module.exports = router;
