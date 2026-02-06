// ================================================
// ROTAS DE PRODUTOS - MONGODB
// ================================================

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Middleware para validar conexão com banco
const checkDbConnection = (req, res, next) => {
    const { isDbConnected } = require('../config/mongodb');
    if (!isDbConnected()) {
        return res.status(503).json({ 
            error: 'Banco de dados não disponível. Tente novamente em alguns instantes.' 
        });
    }
    next();
};

// Aplicar middleware em todas as rotas
router.use(checkDbConnection);

// ================================================
// GET - Listar todos os produtos
// ================================================
router.get('/', async (req, res) => {
    try {
        const { 
            category, 
            featured, 
            active = 'true',
            search,
            sort = '-createdAt',
            limit = 100,
            page = 1
        } = req.query;

        // Construir filtro
        const filter = {};
        
        if (category) filter.category = category;
        if (featured !== undefined) filter.featured = featured === 'true';
        if (active !== undefined) filter.active = active === 'true';
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Calcular paginação
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Buscar produtos
        const products = await Product.find(filter)
            .sort(sort)
            .limit(parseInt(limit))
            .skip(skip)
            .lean();

        // Contar total para paginação
        const total = await Product.countDocuments(filter);

        res.json({
            products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('❌ Erro ao buscar produtos:', error);
        res.status(500).json({ error: 'Erro ao buscar produtos', message: error.message });
    }
});

// ================================================
// GET - Buscar produto por ID (MongoDB _id ou id customizado)
// ================================================
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Tentar buscar por ID customizado ou _id do MongoDB
        let product = await Product.findOne({ id }).lean();
        
        if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
            // Se não encontrou e o ID tem formato de ObjectId, tentar por _id
            product = await Product.findById(id).lean();
        }
        
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Produto não encontrado' });
        }
    } catch (error) {
        console.error('❌ Erro ao buscar produto:', error);
        res.status(500).json({ error: 'Erro ao buscar produto', message: error.message });
    }
});

// ================================================
// POST - Criar novo produto
// ================================================
router.post('/', async (req, res) => {
    try {
        const productData = req.body;
        
        // Validações básicas
        if (!productData.name || !productData.category || productData.price === undefined) {
            return res.status(400).json({ 
                error: 'Dados incompletos. Nome, categoria e preço são obrigatórios.' 
            });
        }

        const newProduct = new Product(productData);
        await newProduct.save();
        
        console.log(`✅ Produto criado: ${newProduct.name} (ID: ${newProduct.id})`);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('❌ Erro ao criar produto:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ error: 'Erro de validação', details: errors });
        }
        
        if (error.code === 11000) {
            return res.status(409).json({ error: 'Produto com este ID já existe' });
        }
        
        res.status(500).json({ error: 'Erro ao criar produto', message: error.message });
    }
});

// ================================================
// PUT - Atualizar produto
// ================================================
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Remover campos que não devem ser atualizados
        delete updateData._id;
        delete updateData.createdAt;
        delete updateData.__v;
        
        // Tentar atualizar por ID customizado
        let product = await Product.findOneAndUpdate(
            { id },
            { $set: updateData },
            { new: true, runValidators: true }
        );
        
        // Se não encontrou e o ID tem formato de ObjectId, tentar por _id
        if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true, runValidators: true }
            );
        }
        
        if (product) {
            console.log(`✅ Produto atualizado: ${product.name} (ID: ${product.id})`);
            res.json(product);
        } else {
            res.status(404).json({ error: 'Produto não encontrado' });
        }
    } catch (error) {
        console.error('❌ Erro ao atualizar produto:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ error: 'Erro de validação', details: errors });
        }
        
        res.status(500).json({ error: 'Erro ao atualizar produto', message: error.message });
    }
});

// ================================================
// DELETE - Excluir produto
// ================================================
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Tentar excluir por ID customizado
        let product = await Product.findOneAndDelete({ id });
        
        // Se não encontrou e o ID tem formato de ObjectId, tentar por _id
        if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findByIdAndDelete(id);
        }
        
        if (product) {
            console.log(`✅ Produto excluído: ${product.name} (ID: ${product.id})`);
            res.json({ message: 'Produto excluído com sucesso', product });
        } else {
            res.status(404).json({ error: 'Produto não encontrado' });
        }
    } catch (error) {
        console.error('❌ Erro ao excluir produto:', error);
        res.status(500).json({ error: 'Erro ao excluir produto', message: error.message });
    }
});

// ================================================
// PATCH - Soft delete (desativar produto)
// ================================================
router.patch('/:id/toggle-active', async (req, res) => {
    try {
        const { id } = req.params;
        
        let product = await Product.findOne({ id });
        
        if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findById(id);
        }
        
        if (product) {
            product.active = !product.active;
            await product.save();
            
            console.log(`✅ Produto ${product.active ? 'ativado' : 'desativado'}: ${product.name}`);
            res.json(product);
        } else {
            res.status(404).json({ error: 'Produto não encontrado' });
        }
    } catch (error) {
        console.error('❌ Erro ao alterar status do produto:', error);
        res.status(500).json({ error: 'Erro ao alterar status do produto', message: error.message });
    }
});

module.exports = router;

