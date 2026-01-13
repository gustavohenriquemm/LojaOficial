const fs = require('fs');
const path = require('path');

// Ler o products.json
const productsFile = path.join(__dirname, 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));

// Mapeamento manual de produtos com imagens segredinho
const imageMapping = {
  '1': { // Malbec Icon
    main: '/img/Fotoprodutos lojaro/3fcf35bd-e85f-416e-bbbb-755c89f39e95-bot-84387-malbec-malbec-desodorante-colonia-frontal-01.jpg',
    secondary: '/img/Fotoprodutos lojaro/f81c5f67-d06b-4ab8-9bdf-405267216f6b-bot-84387-malbec-malbec-desodorante-colonia-segredinho-02.avif'
  },
  '2': { // Malbec Flame
    main: '/img/Fotoprodutos lojaro/8049c997-a5e7-4a5b-8a51-063c557a415f-bot-84399-malbec-flame-desodorante-colonia-frontal-01.jpg',
    secondary: '/img/Fotoprodutos lojaro/5c7ecdac-4ff8-4daa-a887-7feb3120ec43-bot-84399-malbec-flame-desodorante-colonia-segredinho-02.avif'
  },
  '3': { // Lis Flora
    main: '/img/Fotoprodutos lojaro/abe50589-adae-4d27-98af-044ff5bc199f-bot-59466-liz-flora-colonia-frontal-01.jpg',
    secondary: '/img/Fotoprodutos lojaro/836ea39e-d482-4a9d-94f9-58f8c255101b-bot-59466-liz-flora-colonia-segredinho-02.avif'
  },
  '4': { // Elysée Parfum
    main: '/img/Fotoprodutos lojaro/d9fc7260-1684-43c6-a7de-ce33c4020fa9-bot-53518-elysee-edp-perfume-frontal-01.jpg',
    secondary: '/img/Fotoprodutos lojaro/318a98e3-f9dd-4405-9547-68c37e3a91a5-bot-53518-elysee-edp-perfume-segredinho-02.avif'
  },
  '5': { // Elysée Succes
    main: '/img/Fotoprodutos lojaro/fotos_0004s_0002_ely3.avif',
    secondary: null // Não tem segredinho
  },
  '6': { // Elysée Blanc
    main: '/img/Fotoprodutos lojaro/3ebe93f1-7819-4d52-82db-b6786ba8a694-48143-01.jpg',
    secondary: '/img/Fotoprodutos lojaro/ELYSEE-EDP-BLANC-50ml-V2_B48143_SEGREDINHO.avif'
  },
  '7': { // Elysée Nuit
    main: '/img/Fotoprodutos lojaro/f0fab910-15bf-4212-acf0-c345a7a58f45-81331-01.avif',
    secondary: '/img/Fotoprodutos lojaro/elysee_nuit_70899_segredinhos.avif'
  },
  '8': { // Egeo Melancia
    main: '/img/Fotoprodutos lojaro/4df80626-ecd8-4c8e-935a-f6d0e8814249-bot-86982-egeo-melancia-frontal-01.avif',
    secondary: '/img/Fotoprodutos lojaro/04bbcec4-1397-4fad-85f4-611452c85659-bot-86982-egeo-melancia-segredinho-02.avif'
  },
  '9': { // Egeo Blue
    main: '/img/Fotoprodutos lojaro/Egeo-Des-Col-Blue-C-Car-90Ml-B82686_.jpg',
    secondary: '/img/Fotoprodutos lojaro/egeo_blue_B82686_segredinhos.avif'
  },
  '10': { // Egeo Original
    main: '/img/Fotoprodutos lojaro/EGEO-DES-COL-ORIGNL-90ml-V2_B49812.jpg',
    secondary: '/img/Fotoprodutos lojaro/EGEO-DES-COL-ORIGNL-90ml-V2_B49812_SEGREDINHO.avif'
  },
  '11': { // Egeo Cherry Blast
    main: '/img/Fotoprodutos lojaro/Egeo-Des-Col-Cherry-Blast-90Ml-B30363_.avif',
    secondary: '/img/Fotoprodutos lojaro/egeo_cherry_blast_B30363_segredinhos.avif'
  },
  '12': { // Egeo Spicy Vibe
    main: '/img/Fotoprodutos lojaro/Egeo-Des-Col-Spcy-Vibe-C-Car-90Ml-B84214_.jpg',
    secondary: '/img/Fotoprodutos lojaro/egeo_spicyvibe_B84214_segredinhos.avif'
  },
  '13': { // Egeo & Joy
    main: '/img/Fotoprodutos lojaro/f1d41961-d745-4e4a-ba5a-2ade23774182-bot-54278-egeo-e-joy-frontal-01.avif',
    secondary: '/img/Fotoprodutos lojaro/5f7343c9-50e2-4509-b247-a524e3b08da7-bot-54278-egeo-e-joy-segredinho-02.avif'
  },
  '14': { // Egeo Red
    main: '/img/Fotoprodutos lojaro/Egeo-Des-Col-Red-C-Cart-90Ml-B82690_.jpg',
    secondary: '/img/Fotoprodutos lojaro/egeo_red_24507_segredinhos-B82690_.avif'
  },
  '15': { // Egeo Bomb Black
    main: '/img/Fotoprodutos lojaro/Egeo-Des-Col-Bomb-Black-C-Car-90Ml-B82685_.jpg',
    secondary: '/img/Fotoprodutos lojaro/egeo_bombblack_B82685_segredinhos.avif'
  },
  '16': { // Egeo Choc High (frontal-06)
    main: '/img/Fotoprodutos lojaro/489de45e-f68c-499b-84e0-92c6ff3251fd-bot-59436-egeo-choc-high-des-col-frontal-06.jpg',
    secondary: '/img/Fotoprodutos lojaro/405d79ba-4b5f-4f2c-991d-4c76ac340917-bot-59436-egeo-choc-high-des-col-segredinho-02.avif'
  },
  '17': { // Egeo Piña Blast
    main: '/img/Fotoprodutos lojaro/egeo_pina_blast_B30247_segredinhos.avif',
    secondary: null // só tem segredinho
  },
  '18': { // Egeo Choc Seduction
    main: '/img/Fotoprodutos lojaro/egeo_choc_71133_segredinhos_B82689_.avif',
    secondary: null // só tem segredinho
  },
  '19': { // Egeo Vanilla Vibe
    main: '/img/Fotoprodutos lojaro/Egeo-Des-Col-Van-Vibe-90Ml-B84213_.jpg',
    secondary: '/img/Fotoprodutos lojaro/egeo_vanillavibe_80501_segredinhos-B84213.avif'
  },
  '20': { // Floratta Romance de Verão
    main: '/img/Fotoprodutos lojaro/a4bd2f6a-0115-48ec-b02b-e090879ab219-bot-55659-floratta-romance-de-verao-colonia-segreginho-02.avif',
    secondary: null // só tem segredinho
  },
  '21': { // Floratta Blue
    main: '/img/Fotoprodutos lojaro/Floratta-Blue-Desodorante-Colonia-B25458_.jpg',
    secondary: null
  },
  '22': { // Floratta Flores Secretas
    main: '/img/Fotoprodutos lojaro/ac31f864-902e-4c03-a0dd-3fe9d93582fd-bot-48307-floratta-flores-secretas-desodorante-colonia-01.jpg',
    secondary: '/img/Fotoprodutos lojaro/25d04b0a-6554-4548-87c8-13890a713989-bot-48307-floratta-flores-secretas-desodorante-colonia-03.avif'
  },
  '23': { // Floratta Simple Love
    main: '/img/Fotoprodutos lojaro/Floratta-Simple-Love_Desodorante-Colonia-B81954_.jpg',
    secondary: null
  },
  '24': { // Floratta Gold
    main: '/img/Fotoprodutos lojaro/60546dce-fff0-4162-a608-cd239631b2dc-floratta-gold-desodorante-colonia-75ml-b51448-principal-1.avif',
    secondary: null
  },
  '25': { // Floratta Rose
    main: '/img/Fotoprodutos lojaro/BOT_48635_FLORATTA-ROSE_COLONIA_FRONTAL_1.avif',
    secondary: null
  },
  '26': { // Accordes Harmonia
    main: '/img/Fotoprodutos lojaro/BOT_51213_ACCORDES-HARMONIA_COLONIA.jpg',
    secondary: null
  },
  '27': { // Linda & Felicidade
    main: '/img/Fotoprodutos lojaro/976a232d-a17a-45ab-b930-e803cfb67acd-bot-81849-linda-felicidade-colonia-frontal-01.jpg',
    secondary: '/img/Fotoprodutos lojaro/ad623ada-4e13-4023-8c5e-685abb0dbcc7-bot-81849-linda-felicidade-colonia-segredinho-02.avif'
  },
  '28': { // Accordes de Sensualidade
    main: '/img/Fotoprodutos lojaro/accordes_des_colonia_frasco_frente.jpg',
    secondary: null
  }
};

// Atualizar produtos
products.forEach(product => {
  const mapping = imageMapping[product.id];
  if (mapping) {
    // Manter a imagem principal no campo image (para os cards)
    product.image = mapping.main;
    
    // Criar array de imagens para a galeria (página de detalhes)
    product.images = [mapping.main];
    if (mapping.secondary) {
      product.images.push(mapping.secondary);
    }
  }
});

// Salvar o arquivo atualizado
fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
console.log('✅ Products.json atualizado com galeria de imagens!');
console.log(`Total de produtos: ${products.length}`);
console.log(`Produtos com galeria: ${products.filter(p => p.images && p.images.length > 1).length}`);
