const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '../data/products.json');

// Função para ler produtos
async function readProducts() {
    try {
        const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Se o arquivo não existir, retorna array vazio
        return [];
    }
}

// Função para salvar produtos
async function saveProducts(products) {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

// GET - Listar todos os produtos
router.get('/', async (req, res) => {
    try {
        const products = await readProducts();
        res.json(products);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
});

// GET - Buscar produto por ID
router.get('/:id', async (req, res) => {
    try {
        const products = await readProducts();
        const product = products.find(p => p.id === req.params.id);
        
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Produto não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        res.status(500).json({ error: 'Erro ao buscar produto' });
    }
});

// POST - Criar novo produto
router.post('/', async (req, res) => {
    try {
        const products = await readProducts();
        const newProduct = {
            id: Date.now().toString(),
            ...req.body,
            createdAt: new Date().toISOString()
        };
        
        products.push(newProduct);
        await saveProducts(products);
        
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
});

// PUT - Atualizar produto
router.put('/:id', async (req, res) => {
    try {
        const products = await readProducts();
        const index = products.findIndex(p => p.id === req.params.id);
        
        if (index !== -1) {
            products[index] = {
                ...products[index],
                ...req.body,
                id: req.params.id,
                updatedAt: new Date().toISOString()
            };
            
            await saveProducts(products);
            res.json(products[index]);
        } else {
            res.status(404).json({ error: 'Produto não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
});

// DELETE - Excluir produto
router.delete('/:id', async (req, res) => {
    try {
        const products = await readProducts();
        const filteredProducts = products.filter(p => p.id !== req.params.id);
        
        if (filteredProducts.length < products.length) {
            await saveProducts(filteredProducts);
            res.json({ message: 'Produto excluído com sucesso' });
        } else {
            res.status(404).json({ error: 'Produto não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        res.status(500).json({ error: 'Erro ao excluir produto' });
    }
});

module.exports = router;
