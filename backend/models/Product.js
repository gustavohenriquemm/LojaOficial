// ================================================
// MODEL: PRODUTO
// ================================================

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    // ID customizado (pode ser mantido para compatibilidade)
    id: {
        type: String,
        unique: true,
        sparse: true
    },
    name: {
        type: String,
        required: [true, 'Nome do produto é obrigatório'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Categoria é obrigatória'],
        trim: true
    },
    subcategory: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Preço é obrigatório'],
        min: [0, 'Preço não pode ser negativo']
    },
    oldPrice: {
        type: Number,
        min: [0, 'Preço antigo não pode ser negativo'],
        default: null
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: null
    },
    featured: {
        type: Boolean,
        default: false
    },
    stock: {
        type: Number,
        default: 0,
        min: [0, 'Estoque não pode ser negativo']
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
    collection: 'products'
});

// Índices para melhor performance
productSchema.index({ category: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ active: 1 });
productSchema.index({ name: 'text' }); // Para busca textual

// Virtual para calcular desconto
productSchema.virtual('discount').get(function() {
    if (this.oldPrice && this.oldPrice > this.price) {
        return Math.round(((this.oldPrice - this.price) / this.oldPrice) * 100);
    }
    return 0;
});

// Garantir que virtuals sejam incluídos no JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// Middleware pre-save para gerar ID customizado se não existir
productSchema.pre('save', function(next) {
    if (!this.id) {
        // Gera ID baseado em timestamp + random
        this.id = `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
