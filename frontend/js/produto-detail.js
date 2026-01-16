// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id'); // Não converter para int, manter como string

// Products array
let allProducts = [];
let currentProduct = null;

// Load products from API
async function loadProductsFromAPI() {
    console.log('Carregando produtos da API...');
    console.log('Product ID da URL:', productId);
    try {
        // Usar API_URL do escopo global definido em script.js
        const apiUrl = window.API_URL || 'http://localhost:3000/api/products';
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Erro ao carregar produtos');
        allProducts = await response.json();
        console.log('Produtos carregados:', allProducts.length);
        console.log('Procurando produto com ID:', productId);
        // Comparar como string para compatibilidade
        currentProduct = allProducts.find(p => String(p.id) === String(productId));
        console.log('Produto encontrado:', currentProduct);
        displayProductDetail();
        displayRelatedProducts();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        const productDetailContainer = document.getElementById('productDetail');
        if (productDetailContainer) {
            productDetailContainer.innerHTML = `
                <div class="product-not-found">
                    <h2>Erro ao carregar produto</h2>
                    <p>Não foi possível carregar as informações do produto. Por favor, tente novamente.</p>
                    <a href="produtos.html" class="btn btn-primary">Ver Todos os Produtos</a>
                </div>
            `;
        }
    }
}

// Format price helper
function formatPrice(price) {
    return `R$ ${parseFloat(price).toFixed(2).replace('.', ',')}`;
}

function displayProductDetail() {
    const productDetailContainer = document.getElementById('productDetail');
    const breadcrumbProduct = document.getElementById('breadcrumbProduct');
    
    if (!currentProduct) {
        productDetailContainer.innerHTML = `
            <div class="product-not-found">
                <h2>Produto não encontrado</h2>
                <p>O produto que você está procurando não existe ou foi removido.</p>
                <a href="produtos.html" class="btn btn-primary">Ver Todos os Produtos</a>
            </div>
        `;
        return;
    }

    // Update breadcrumb
    breadcrumbProduct.textContent = currentProduct.name;
    document.title = `${currentProduct.name} - Presentes Especiais`;

    // Display product
    const discount = currentProduct.oldPrice 
        ? Math.round(((currentProduct.oldPrice - currentProduct.price) / currentProduct.oldPrice) * 100)
        : 0;

    // Criar galeria de imagens
    const hasGallery = currentProduct.images && currentProduct.images.length > 1;
    let galleryHTML = '';
    
    if (hasGallery) {
        galleryHTML = `
            <div class="product-gallery">
                <div class="product-gallery-main">
                    <img id="mainProductImage" src="${currentProduct.images[0]}" alt="${currentProduct.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <div class="product-image-placeholder" style="display: none;">
                        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#ffbdbd" stroke-width="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                            <circle cx="12" cy="12" r="3"></circle>
                            <line x1="3" y1="3" x2="7" y2="7"></line>
                        </svg>
                    </div>
                </div>
                <div class="product-gallery-thumbs">
                    ${currentProduct.images.map((img, index) => `
                        <img src="${img}" 
                             alt="${currentProduct.name} - Imagem ${index + 1}" 
                             class="gallery-thumb ${index === 0 ? 'active' : ''}"
                             onclick="changeMainImage('${img}', ${index})">
                    `).join('')}
                </div>
            </div>
        `;
    } else if (currentProduct.image) {
        galleryHTML = `
            <img src="${currentProduct.image}" alt="${currentProduct.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
            <div class="product-image-placeholder" style="display: none;">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#ffbdbd" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                    <circle cx="12" cy="12" r="3"></circle>
                    <line x1="3" y1="3" x2="7" y2="7"></line>
                </svg>
            </div>
        `;
    } else {
        galleryHTML = `
            <div class="product-image-placeholder">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#ffbdbd" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                    <circle cx="12" cy="12" r="3"></circle>
                    <line x1="3" y1="3" x2="7" y2="7"></line>
                </svg>
            </div>
        `;
    }

    productDetailContainer.innerHTML = `
        <div class="product-detail-grid">
            <div class="product-detail-image">
                ${galleryHTML}
            </div>

            <div class="product-detail-info">
                <div class="product-detail-category">${currentProduct.category}</div>
                <h1 class="product-detail-title">${currentProduct.name}</h1>
                
                <div class="product-detail-prices">
                    <div class="product-detail-price">R$ ${currentProduct.price.toFixed(2)}</div>
                    ${currentProduct.oldPrice 
                        ? `<div class="product-detail-old-price">R$ ${currentProduct.oldPrice.toFixed(2)}</div>
                           <div class="product-detail-discount">${discount}% OFF</div>`
                        : ''
                    }
                </div>

                <div class="product-detail-description">
                    <h3>Descrição</h3>
                    <p>${currentProduct.description}</p>
                </div>

                <!-- FRETE -->
                <div class="frete-box">
                    <h3>Calcule o Frete</h3>
                    <div class="frete-form">
                        <input type="text" id="cepDestino" maxlength="9" placeholder="Digite seu CEP" class="frete-input" />
                        <button class="btn btn-secondary" id="btnCalcularFrete">Calcular Frete</button>
                    </div>
                    <div id="freteResultado" class="frete-resultado"></div>
                </div>

                <div class="product-detail-actions">
                    <div class="quantity-selector">
                        <button class="quantity-btn" onclick="changeQuantity(-1)">-</button>
                        <input type="number" id="productQuantity" value="1" min="1" readonly>
                        <button class="quantity-btn" onclick="changeQuantity(1)">+</button>
                    </div>
                    
                    <button class="btn btn-primary btn-large" onclick="addProductToCart()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        Adicionar ao Carrinho
                    </button>
                </div>

                <div class="product-detail-features">
                    <div class="feature-item">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <span>Produto de qualidade garantida</span>
                    </div>
                    <div class="feature-item">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2">
                            <rect x="1" y="3" width="15" height="13"></rect>
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                            <circle cx="5.5" cy="18.5" r="2.5"></circle>
                            <circle cx="18.5" cy="18.5" r="2.5"></circle>
                        </svg>
                        <span>Entrega rápida e segura</span>
                    </div>
                    <div class="feature-item">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2">
                            <path d="M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a1 1 0 0 0-1-1z"></path>
                        </svg>
                        <span>Embalagem especial para presente</span>
                    </div>
                </div>
            </div>
        </div>
    `;
// --- FRETE ---
document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'btnCalcularFrete') {
        calcularFreteHandler();
    }
});

function calcularFreteHandler() {
    const cepDestino = document.getElementById('cepDestino').value.replace(/\D/g, '');
    const resultado = document.getElementById('freteResultado');
    resultado.innerHTML = '';
    if (!cepDestino || cepDestino.length < 8) {
        resultado.innerHTML = '<span style="color:red">Digite um CEP válido.</span>';
        return;
    }
    // Dados simulados do produto (poderia vir do backend)
    const cepOrigem = '01001000'; // Exemplo: centro de SP
    const peso = currentProduct.peso || 0.5; // kg (simulado)
    const altura = currentProduct.altura || 10; // cm
    const largura = currentProduct.largura || 15; // cm
    const comprimento = currentProduct.comprimento || 20; // cm

    // Peso cúbico
    const pesoCubico = (altura * largura * comprimento) / 6000;
    const pesoFinal = Math.max(peso, pesoCubico);

    // Simulação de distância (quanto mais diferente o CEP, maior a distância)
    let distancia = Math.abs(parseInt(cepDestino.substring(0, 5)) - parseInt(cepOrigem.substring(0, 5)));
    if (isNaN(distancia)) distancia = 1000;

    // Simulação de valores
    const basePAC = 18 + pesoFinal * 6 + distancia * 0.01;
    const baseSEDEX = 28 + pesoFinal * 9 + distancia * 0.018;
    const prazoPAC = 5 + Math.ceil(distancia / 1000);
    const prazoSEDEX = 2 + Math.ceil(distancia / 2000);

    resultado.innerHTML = `
        <div class="frete-opcao">
            <strong>PAC:</strong> R$ ${basePAC.toFixed(2)}<br>
            <span>Prazo estimado: ${prazoPAC} dias úteis</span>
        </div>
        <div class="frete-opcao">
            <strong>SEDEX:</strong> R$ ${baseSEDEX.toFixed(2)}<br>
            <span>Prazo estimado: ${prazoSEDEX} dias úteis</span>
        </div>
    `;
}
}

function changeQuantity(delta) {
    const quantityInput = document.getElementById('productQuantity');
    let newValue = parseInt(quantityInput.value) + delta;
    if (newValue < 1) newValue = 1;
    quantityInput.value = newValue;
}

function addProductToCart() {
    if (!currentProduct) {
        console.error('Nenhum produto atual para adicionar ao carrinho');
        return;
    }
    
    console.log('Adicionando produto ao carrinho:', currentProduct);
    const quantity = parseInt(document.getElementById('productQuantity').value);
    console.log('Quantidade:', quantity);
    
    // Add to cart multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
        addToCart(currentProduct.id);
    }
    
    // Reset quantity
    document.getElementById('productQuantity').value = 1;
}

function displayRelatedProducts() {
    const relatedProductsContainer = document.getElementById('relatedProducts');
    
    if (!currentProduct) return;
    
    // Get products from same category
    const relatedProducts = allProducts
        .filter(p => String(p.id) !== String(currentProduct.id) && p.category === currentProduct.category)
        .slice(0, 4);
    
    if (relatedProducts.length === 0) {
        relatedProductsContainer.innerHTML = '<p class="empty-message">Nenhum produto relacionado encontrado</p>';
        return;
    }
    
    relatedProductsContainer.innerHTML = relatedProducts.map(product => `
        <div class="product-card">
            <a href="produto.html?id=${product.id}" class="product-card-link">
                <div class="product-image">
                    ${product.image 
                        ? `<img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                           <div class="product-placeholder" style="display: none;">
                               <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ffbdbd" stroke-width="1.5">
                                   <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                                   <circle cx="12" cy="12" r="3"></circle>
                                   <line x1="3" y1="3" x2="7" y2="7"></line>
                               </svg>
                           </div>`
                        : `<div class="product-placeholder">
                               <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ffbdbd" stroke-width="1.5">
                                   <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                                   <circle cx="12" cy="12" r="3"></circle>
                                   <line x1="3" y1="3" x2="7" y2="7"></line>
                               </svg>
                           </div>`
                    }
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-footer">
                        <div>
                            <div class="product-price">${formatPrice(product.price)}</div>
                            ${product.oldPrice ? `<div class="product-old-price">${formatPrice(product.oldPrice)}</div>` : ''}
                        </div>
                        <button class="add-to-cart-btn" onclick="event.preventDefault(); event.stopPropagation(); addToCart('${product.id}'); return false;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            Adicionar
                        </button>
                    </div>
                </div>
            </a>
        </div>
    `).join('');
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadProductsFromAPI();
});

// Function to change main image in gallery
function changeMainImage(imageUrl, index) {
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage) {
        mainImage.src = imageUrl;
        
        // Update active thumbnail
        document.querySelectorAll('.gallery-thumb').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }
}

// Make functions global
window.changeQuantity = changeQuantity;
window.addProductToCart = addProductToCart;
window.changeMainImage = changeMainImage;
