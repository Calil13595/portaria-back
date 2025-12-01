// controllers/userController.js
const supabase = require('../supabase/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10; 

// ------------------------------------
// RF01 - Cadastro de Novo Porteiro (Register)
// ------------------------------------
exports.register = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        // 1. Cria o hash da senha
        const hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);

        // 2. Insere o novo usuário na tabela 'usuarios'
        const { data, error } = await supabase
            .from('usuarios')
            .insert([{ nome, email, senha: hashedPassword }])
            .select('id, nome, email'); // Seleciona apenas dados seguros para retornar

        if (error) {
            if (error.code === '23505') { // Código de violação de chave única (e-mail já existe)
                return res.status(409).json({ error: 'E-mail já cadastrado.' });
            }
            throw error;
        }

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!', user: data[0] });

    } catch (error) {
        console.error('Erro no registro:', error.message);
        res.status(500).json({ error: 'Falha no servidor ao tentar registrar o usuário.' });
    }
};

// ------------------------------------
// RF02 - Autenticação de Porteiro (Login)
// ------------------------------------
exports.login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    try {
        // 1. Busca o usuário pelo e-mail
        const { data: users, error } = await supabase
            .from('usuarios')
            .select('*') // Precisa de todos os dados, incluindo o hash da senha
            .eq('email', email)
            .single();

        if (error || !users) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }
        
        // 2. Compara a senha fornecida com o hash salvo
        const match = await bcrypt.compare(senha, users.senha);

        if (!match) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        // 3. Senha correta, gera o JWT
        const token = jwt.sign(
            { id: users.id, email: users.email }, 
            JWT_SECRET, 
            { expiresIn: '8h' }
        );

        // 4. Retorna o token e dados seguros do usuário
        res.status(200).json({ 
            message: 'Login realizado com sucesso.', 
            token: token,
            user: { id: users.id, nome: users.nome, email: users.email }
        });

    } catch (error) {
        console.error('Erro no login:', error.message);
        res.status(500).json({ error: 'Falha no servidor ao tentar realizar o login.' });
    }
};