// controllers/registrosController.js
const supabase = require('../supabase/client');

// ------------------------------------
// RF04 - Listagem de Registros de Visitantes (Read All)
// ------------------------------------
exports.getAllRegistros = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('visitantes') 
            .select('*')
            .order('horario_entrada', { ascending: false });

        if (error) throw error;

        res.status(200).json(data);

    } catch (error) {
        console.error('Erro ao buscar lista de registros:', error.message);
        res.status(500).json({ error: 'Falha ao carregar a lista de visitantes.' });
    }
};

// ------------------------------------
// RF03 - Criação de Novo Registro (Create - Entrada)
// ------------------------------------
exports.createRegistro = async (req, res) => {
    const { nome_visitante, documento, apartamento_destino, observacao } = req.body;
    
    // Pega o ID do porteiro do token JWT (adicionado pelo middleware)
    const porteiro_id = req.user.id; 

    if (!nome_visitante || !apartamento_destino) {
        return res.status(400).json({ error: 'O nome do visitante e o apartamento de destino são obrigatórios.' });
    }

    try {
        const { data, error } = await supabase
            .from('visitantes')
            .insert([{ 
                nome_visitante, 
                documento, 
                apartamento_destino, 
                observacao, 
                porteiro_id
            }])
            .select();

        if (error) throw error;

        res.status(201).json({ message: 'Registro de entrada criado com sucesso!', registro: data[0] });

    } catch (error) {
        console.error('Erro ao criar registro:', error.message);
        res.status(500).json({ error: 'Falha ao registrar a entrada do visitante.' });
    }
};

// ------------------------------------
// RF03 - Atualização de Registro (Update - Ex: Registrar Saída)
// ------------------------------------
exports.updateRegistro = async (req, res) => {
    const { id } = req.params; 
    const updates = req.body; 

    try {
        const { data, error } = await supabase
            .from('visitantes')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        
        if (data.length === 0) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        res.status(200).json({ message: 'Registro atualizado com sucesso!', registro: data[0] });

    } catch (error) {
        console.error('Erro ao atualizar registro:', error.message);
        res.status(500).json({ error: 'Falha ao atualizar o registro do visitante.' });
    }
};

// ------------------------------------
// RF03 - Exclusão de Registro (Delete)
// ------------------------------------
exports.deleteRegistro = async (req, res) => {
    const { id } = req.params; 

    try {
        const { error } = await supabase
            .from('visitantes')
            .delete()
            .eq('id', id);

        if (error) throw error;
        
        res.status(200).json({ message: `Registro ID ${id} excluído com sucesso.` });

    } catch (error) {
        console.error('Erro ao excluir registro:', error.message);
        res.status(500).json({ error: 'Falha ao excluir o registro.' });
    }
};