// ===================================
// SAMPLE PRODUCTS DATA
// ===================================

// Default products array
const defaultProducts = [
    // Cosmético Feminino - Perfumes
    {
        id: 1,
        name: "Perfume Floral Elegance Feminino",
        category: "Cosmético Feminino",
        subcategory: "Perfumes",
        price: 189.90,
        oldPrice: 249.90,
        description: "Fragrância sofisticada e duradoura para momentos especiais",
        image: null
    },
    {
        id: 2,
        name: "Perfume Floral Delicado",
        category: "Cosmético Feminino",
        subcategory: "Perfumes",
        price: 129.90,
        oldPrice: null,
        description: "Aroma suave e romântico para o dia a dia",
        image: null
    },
    // Cosmético Feminino - Cremes
    {
        id: 3,
        name: "Creme Hidratante Facial Premium",
        category: "Cosmético Feminino",
        subcategory: "Cremes",
        price: 89.90,
        oldPrice: 109.90,
        description: "Hidratação profunda e anti-idade para pele radiante",
        image: null
    },
    {
        id: 4,
        name: "Creme Corporal Nutritivo",
        category: "Cosmético Feminino",
        subcategory: "Cremes",
        price: 69.90,
        oldPrice: null,
        description: "Nutrição intensa com fragrância suave",
        image: null
    },
    // Cosmético Feminino - Sabonetes
    {
        id: 5,
        name: "Sabonete Líquido Floral",
        category: "Cosmético Feminino",
        subcategory: "Sabonetes",
        price: 39.90,
        oldPrice: 49.90,
        description: "Limpeza suave com essências florais",
        image: null
    },
    {
        id: 6,
        name: "Kit Sabonetes Artesanais",
        category: "Cosmético Feminino",
        subcategory: "Sabonetes",
        price: 59.90,
        oldPrice: null,
        description: "3 sabonetes artesanais com aromas exclusivos",
        image: null
    },
    // Cosmético Feminino - Body Splash
    {
        id: 7,
        name: "Body Splash Floral Fresh",
        category: "Cosmético Feminino",
        subcategory: "Body Splash",
        price: 49.90,
        oldPrice: 59.90,
        description: "Fragrância leve e refrescante para o dia a dia",
        image: null
    },
    {
        id: 8,
        name: "Body Splash Romance",
        category: "Cosmético Feminino",
        subcategory: "Body Splash",
        price: 54.90,
        oldPrice: null,
        description: "Aroma envolvente e duradouro",
        image: null
    },
    // Cosmético Feminino - Esfoliantes
    {
        id: 9,
        name: "Esfoliante Facial Revitalizante",
        category: "Cosmético Feminino",
        subcategory: "Esfoliantes",
        price: 79.90,
        oldPrice: null,
        description: "Renovação celular e pele mais luminosa",
        image: null
    },
    {
        id: 10,
        name: "Esfoliante Corporal Nutritivo",
        category: "Cosmético Feminino",
        subcategory: "Esfoliantes",
        price: 69.90,
        oldPrice: 89.90,
        description: "Remove impurezas e nutre a pele",
        image: null
    },
    // Cosmético Feminino - Outros Cuidados
    {
        id: 11,
        name: "Máscara Facial Hidratante",
        category: "Cosmético Feminino",
        subcategory: "Outros Cuidados",
        price: 45.90,
        oldPrice: null,
        description: "Hidratação intensiva em 15 minutos",
        image: null
    },
    {
        id: 12,
        name: "Sérum Anti-idade",
        category: "Cosmético Feminino",
        subcategory: "Outros Cuidados",
        price: 149.90,
        oldPrice: 199.90,
        description: "Tratamento intensivo contra sinais do tempo",
        image: null
    },
    // Cosmético Masculino - Perfumes
    {
        id: 13,
        name: "Perfume Amadeirado Masculino",
        category: "Cosmético Masculino",
        subcategory: "Perfumes",
        price: 179.90,
        oldPrice: 229.90,
        description: "Fragrância marcante e sofisticada",
        image: null
    },
    {
        id: 14,
        name: "Perfume Fresh Masculino",
        category: "Cosmético Masculino",
        subcategory: "Perfumes",
        price: 139.90,
        oldPrice: null,
        description: "Aroma fresco e envolvente para o dia a dia",
        image: null
    },
    // Cosmético Masculino - Cremes
    {
        id: 15,
        name: "Creme Facial Hidratante Masculino",
        category: "Cosmético Masculino",
        subcategory: "Cremes",
        price: 79.90,
        oldPrice: 99.90,
        description: "Hidratação sem deixar oleosidade",
        image: null
    },
    {
        id: 16,
        name: "Creme Pós-Barba Revitalizante",
        category: "Cosmético Masculino",
        subcategory: "Cremes",
        price: 59.90,
        oldPrice: null,
        description: "Acalma e hidrata após o barbear",
        image: null
    },
    // Cosmético Masculino - Sabonetes
    {
        id: 17,
        name: "Sabonete Líquido Masculino Fresh",
        category: "Cosmético Masculino",
        subcategory: "Sabonetes",
        price: 42.90,
        oldPrice: null,
        description: "Limpeza profunda com fragrância masculina",
        image: null
    },
    {
        id: 18,
        name: "Kit Sabonetes em Barra Masculino",
        category: "Cosmético Masculino",
        subcategory: "Sabonetes",
        price: 54.90,
        oldPrice: 69.90,
        description: "3 sabonetes com diferentes fragrâncias",
        image: null
    },
    // Cosmético Masculino - Body Splash
    {
        id: 19,
        name: "Body Splash Sport Masculino",
        category: "Cosmético Masculino",
        subcategory: "Body Splash",
        price: 52.90,
        oldPrice: null,
        description: "Fragrância energizante e refrescante",
        image: null
    },
    {
        id: 20,
        name: "Body Splash Classic Masculino",
        category: "Cosmético Masculino",
        subcategory: "Body Splash",
        price: 49.90,
        oldPrice: 59.90,
        description: "Aroma clássico e duradouro",
        image: null
    },
    // Cosmético Masculino - Esfoliantes
    {
        id: 21,
        name: "Esfoliante Facial Masculino",
        category: "Cosmético Masculino",
        subcategory: "Esfoliantes",
        price: 69.90,
        oldPrice: null,
        description: "Remove impurezas e prepara para o barbear",
        image: null
    },
    {
        id: 22,
        name: "Esfoliante Corporal Masculino",
        category: "Cosmético Masculino",
        subcategory: "Esfoliantes",
        price: 74.90,
        oldPrice: 89.90,
        description: "Limpeza profunda e revitalizante",
        image: null
    },
    // Cosmético Masculino - Outros Cuidados
    {
        id: 23,
        name: "Gel de Barbear Premium",
        category: "Cosmético Masculino",
        subcategory: "Outros Cuidados",
        price: 39.90,
        oldPrice: null,
        description: "Barbear suave e confortável",
        image: null
    },
    {
        id: 24,
        name: "Sérum Anti-idade Masculino",
        category: "Cosmético Masculino",
        subcategory: "Outros Cuidados",
        price: 139.90,
        oldPrice: 179.90,
        description: "Combate rugas e sinais de cansaço",
        image: null
    }
];

// Load products from localStorage or use default
let products = JSON.parse(localStorage.getItem('products')) || defaultProducts;

// Save default products if not exists
if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(defaultProducts));
    products = defaultProducts;
}

// Sync products from localStorage periodically
function syncProductsFromStorage() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    }
}

// Call sync on page load to ensure latest products
syncProductsFromStorage();

// ===================================
// CART MANAGEMENT
// ===================================

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartModal();
    showNotification('Produto adicionado ao carrinho!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartModal();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartModal();
        updateCartCount();
    }
}

function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function formatPrice(price) {
    return price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function updateCartModal() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
        cartTotal.textContent = formatPrice(0);
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffbdbd" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `).join('');

    cartTotal.textContent = formatPrice(calculateTotal());
}

// ===================================
// DISPLAY PRODUCTS
// ===================================

function displayFeaturedProducts() {
    const productsContainer = document.getElementById('featuredProducts');
    if (!productsContainer) return;

    syncProductsFromStorage();
    const featuredProducts = products.slice(0, 6);

    productsContainer.innerHTML = featuredProducts.map(product => `
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
                        <button class="add-to-cart-btn" onclick="event.preventDefault(); event.stopPropagation(); addToCart(${product.id})">
                            Adicionar
                        </button>
                    </div>
                </div>
            </a>
        </div>
    `).join('');
}

function displayAllProducts() {
    const productsContainer = document.getElementById('allProducts');
    if (!productsContainer) return;

    syncProductsFromStorage();

    productsContainer.innerHTML = products.map(product => `
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
                        <button class="add-to-cart-btn" onclick="event.preventDefault(); event.stopPropagation(); addToCart(${product.id})">
                            Adicionar
                        </button>
                    </div>
                </div>
            </a>
        </div>
    `).join('');
}

// ===================================
// NAVIGATION & UI INTERACTIONS
// ===================================

function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

function setupCartModal() {
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const closeCartModal = document.getElementById('closeCartModal');

    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', () => {
            cartModal.classList.add('active');
            updateCartModal();
        });
    }

    if (closeCartModal && cartModal) {
        closeCartModal.addEventListener('click', () => {
            cartModal.classList.remove('active');
        });
    }

    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove('active');
            }
        });
    }
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            // Implementar lógica de busca aqui
            console.log('Buscando por:', searchTerm);
        });
    }
}

function showNotification(message) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remover após 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Adicionar animações ao CSS dinamicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// ACTIVE LINK MANAGEMENT
// ===================================

function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// ===================================
// SMOOTH SCROLL
// ===================================

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===================================
// FILTER PRODUCTS BY CATEGORY
// ===================================

function filterProductsByCategory(category) {
    const productsContainer = document.getElementById('allProducts');
    if (!productsContainer) return;

    syncProductsFromStorage();
    
    const filteredProducts = category === 'todos' 
        ? products 
        : products.filter(p => p.category.toLowerCase() === category.toLowerCase());

    productsContainer.innerHTML = filteredProducts.map(product => `
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
                        <button class="add-to-cart-btn" onclick="event.preventDefault(); event.stopPropagation(); addToCart(${product.id})">
                            Adicionar
                        </button>
                    </div>
                </div>
            </a>
        </div>
    `).join('');
}

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    updateCartCount();
    setupMobileMenu();
    setupCartModal();
    setupSearch();
    setActiveLink();
    setupSmoothScroll();
    
    // Display products if on homepage
    displayFeaturedProducts();
    
    // Display all products if on products page
    displayAllProducts();
    
    console.log('Site carregado com sucesso!');
});

// Export functions for use in HTML onclick attributes
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.filterProductsByCategory = filterProductsByCategory;
