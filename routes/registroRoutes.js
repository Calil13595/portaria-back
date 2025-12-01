// routes/registroRoutes.js
const express = require('express');
const router = express.Router();

const registrosController = require('../controllers/registrosController');
const { protect } = require('../middleware/auth'); // Importa o middleware de proteção

// Todas as rotas de CRUD de registros (Visitantes) são PROTEGIDAS (RF02/RF03)

// RF04 - Leitura de todos os registros (Lista)
router.get('/', protect, registrosController.getAllRegistros);

// RF03 - Criação de novo registro (Entrada de Visitante)
router.post('/', protect, registrosController.createRegistro);

// RF03 - Edição de registro (Ex: Registrar Saída)
router.put('/:id', protect, registrosController.updateRegistro);

// RF03 - Exclusão de registro (Delete)
router.delete('/:id', protect, registrosController.deleteRegistro);

module.exports = router;