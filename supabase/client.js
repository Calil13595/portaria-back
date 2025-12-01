// supabase/client.js
const { createClient } = require('@supabase/supabase-js');
// O .env já foi carregado no server.js, então podemos usar process.env

// Usamos a Chave Secreta (SUPABASE_KEY) no Back-end para acesso privilegiado e seguro.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY; 

// Verifica se as chaves estão presentes
if (!supabaseUrl || !supabaseKey) {
    console.error("ERRO FATAL: SUPABASE_URL ou SUPABASE_KEY não estão definidos no .env!");
    process.exit(1); // Encerra a aplicação se as chaves essenciais faltarem
}

// Cria e exporta o cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔗 Cliente Supabase inicializado com sucesso.');

module.exports = supabase;