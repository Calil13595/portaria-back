// routes/userRoutes.js
const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// RF01 - Rota para cadastro de novo porteiro
router.post('/register', userController.register);

// RF02 - Rota para autenticação (login)
router.post('/login', userController.login);

module.exports = router;