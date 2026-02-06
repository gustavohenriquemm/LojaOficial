// ================================================
// SCRIPT DE MIGRAÇÃO - JSON PARA MONGODB
// ================================================

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const { connectDatabase, disconnectDatabase } = require('./config/mongodb');
const Product = require('./models/Product');

/**
 * Script para migrar produtos do arquivo JSON para MongoDB
 */
async function migrateProducts() {
    console.log('🚀 Iniciando migração de produtos...\n');

    try {
        // Conectar ao MongoDB
        const connected = await connectDatabase();
        if (!connected) {
            console.error('❌ Não foi possível conectar ao MongoDB');
            console.log('📝 Verifique se a variável MONGODB_URI está configurada no .env');
            process.exit(1);
        }

        // Caminho do arquivo de produtos
        const productsFilePath = path.join(__dirname, 'data', 'products.json');
        
        // Verificar se o arquivo existe
        try {
            await fs.access(productsFilePath);
        } catch (error) {
            console.log('⚠️ Arquivo products.json não encontrado.');
            console.log('💡 Não há dados para migrar. Base de dados MongoDB está pronta para uso.\n');
            await disconnectDatabase();
            return;
        }

        // Ler arquivo JSON
        console.log('📖 Lendo produtos do arquivo JSON...');
        const fileContent = await fs.readFile(productsFilePath, 'utf8');
        const products = JSON.parse(fileContent);

        if (!Array.isArray(products) || products.length === 0) {
            console.log('⚠️ Nenhum produto encontrado no arquivo JSON.');
            console.log('💡 Base de dados MongoDB está pronta para uso.\n');
            await disconnectDatabase();
            return;
        }

        console.log(`📦 ${products.length} produtos encontrados no arquivo JSON\n`);

        // Perguntar se deseja limpar a base antes de migrar
        console.log('⚠️ Esta operação irá:');
        console.log('   1. Limpar todos os produtos existentes no MongoDB');
        console.log('   2. Inserir os produtos do arquivo JSON\n');

        // Limpar produtos existentes
        const deleteResult = await Product.deleteMany({});
        console.log(`🗑️ ${deleteResult.deletedCount} produtos removidos do MongoDB\n`);

        // Inserir produtos
        console.log('💾 Inserindo produtos no MongoDB...');
        let successCount = 0;
        let errorCount = 0;

        for (const productData of products) {
            try {
                // Criar novo produto
                const product = new Product(productData);
                await product.save();
                
                successCount++;
                console.log(`   ✓ ${product.name} (ID: ${product.id})`);
            } catch (error) {
                errorCount++;
                console.error(`   ✗ Erro ao inserir ${productData.name}:`, error.message);
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('📊 RESULTADO DA MIGRAÇÃO');
        console.log('='.repeat(60));
        console.log(`✅ Produtos migrados com sucesso: ${successCount}`);
        console.log(`❌ Erros durante migração: ${errorCount}`);
        console.log(`📦 Total de produtos no MongoDB: ${await Product.countDocuments()}`);
        console.log('='.repeat(60) + '\n');

        if (successCount > 0) {
            console.log('✅ Migração concluída com sucesso!');
            console.log('💡 Você pode agora deletar ou fazer backup do arquivo products.json\n');
        }

    } catch (error) {
        console.error('❌ Erro durante a migração:', error);
        console.error('Stack:', error.stack);
        process.exit(1);
    } finally {
        await disconnectDatabase();
    }
}

// Executar migração se o script for chamado diretamente
if (require.main === module) {
    migrateProducts().catch((error) => {
        console.error('❌ Erro fatal:', error);
        process.exit(1);
    });
}

module.exports = { migrateProducts };
