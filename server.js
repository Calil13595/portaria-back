// server.js
require('dotenv').config(); // 1. Carrega as variáveis do .env

const express = require('express');
const cors = require('cors'); // Para permitir comunicação Front-end/Back-end
const app = express();
const PORT = process.env.PORT || 3001; // Porta padrão 3000 ou fallback

// --- 2. Importação das Rotas ---
const userRoutes = require('./routes/userRoutes');
const registroRoutes = require('./routes/registroRoutes'); // Seu CRUD de Visitantes

// --- 3. Middlewares ---
// Permite que o Front-end (Vercel) acesse o Back-end (Render)
app.use(cors()); 
// Permite que o Express leia o corpo das requisições como JSON
app.use(express.json()); 

// --- 4. Configuração das Rotas Base ---
// Rotas de Autenticação (Login/Cadastro)
app.use('/api/auth', userRoutes); 
// Rotas de Registros/Visitantes (CRUD protegido por JWT)
app.use('/api/registros', registroRoutes); 

// Rota de Teste (Health Check)
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'API de Portaria do Condomínio online.',
        ambiente: process.env.NODE_ENV || 'development' 
    });
});

// --- 5. Inicialização do Servidor ---
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    // Opcional: Chamar a conexão com o banco aqui para testar se está vivo
    require('./supabase/client');
});