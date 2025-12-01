// middleware/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware para verificar a autenticidade do JWT.
 */
exports.protect = (req, res, next) => {
    // 1. Obtém o token do cabeçalho 'Authorization: Bearer [token]'
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido ou formato inválido.' });
    }

    // 2. Extrai o token
    const token = authHeader.split(' ')[1];

    try {
        // 3. Verifica e decodifica o token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // 4. Anexa as informações do usuário logado (id, email) ao objeto 'req'
        req.user = decoded; 

        // 5. Continua para a próxima função (o controller)
        next(); 

    } catch (err) {
        // 6. Trata erros como token expirado ou inválido
        if (err.name === 'TokenExpiredError') {
             return res.status(401).json({ error: 'Token expirado. Por favor, faça login novamente.' });
        }
        return res.status(401).json({ error: 'Token inválido.' });
    }
};