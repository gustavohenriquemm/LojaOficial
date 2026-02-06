// ================================================
// CONFIGURAÇÃO MONGODB ATLAS
// ================================================

const mongoose = require('mongoose');

// Estado da conexão
let isConnected = false;

/**
 * Conecta ao MongoDB Atlas
 * @returns {Promise<boolean>} True se conectado com sucesso
 */
async function connectDatabase() {
    if (isConnected) {
        console.log('✓ MongoDB já está conectado');
        return true;
    }

    try {
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            console.error('❌ MONGODB_URI não configurado no .env');
            console.log('📝 Adicione a variável MONGODB_URI com sua connection string do MongoDB Atlas');
            return false;
        }

        console.log('🔌 Conectando ao MongoDB Atlas...');
        
        await mongoose.connect(mongoUri, {
            // Opções recomendadas para MongoDB 6.x+
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        isConnected = true;
        console.log('✅ MongoDB conectado com sucesso!');
        console.log(`📦 Database: ${mongoose.connection.name}`);
        
        // Event listeners para monitorar a conexão
        mongoose.connection.on('error', (err) => {
            console.error('❌ Erro na conexão MongoDB:', err);
            isConnected = false;
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB desconectado');
            isConnected = false;
        });

        mongoose.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconectado');
            isConnected = true;
        });

        return true;
    } catch (error) {
        console.error('❌ Erro ao conectar no MongoDB:', error.message);
        isConnected = false;
        return false;
    }
}

/**
 * Desconecta do MongoDB
 */
async function disconnectDatabase() {
    if (!isConnected) {
        return;
    }

    try {
        await mongoose.disconnect();
        isConnected = false;
        console.log('✅ MongoDB desconectado');
    } catch (error) {
        console.error('❌ Erro ao desconectar MongoDB:', error.message);
    }
}

/**
 * Verifica status da conexão
 * @returns {boolean}
 */
function isDbConnected() {
    return isConnected && mongoose.connection.readyState === 1;
}

module.exports = {
    connectDatabase,
    disconnectDatabase,
    isDbConnected,
    mongoose
};
