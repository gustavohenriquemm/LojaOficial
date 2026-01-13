// ===================================
// CHECKOUT DATA
// ===================================

let currentStep = 1;
let checkoutData = {
    customer: {
        name: '',
        phone: '',
        email: ''
    },
    address: {
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        complement: ''
    }
};

// ===================================
// STEP NAVIGATION
// ===================================

function goToStep(step) {
    // Adicionar loading visual
    const activeContent = document.querySelector('.checkout-step.active .checkout-content');
    if (activeContent) {
        activeContent.style.opacity = '0.6';
        activeContent.style.pointerEvents = 'none';
    }
    
    // Pequeno delay para feedback visual
    setTimeout(() => {
        // Hide all steps
        document.querySelectorAll('.checkout-step').forEach(s => {
            s.classList.remove('active');
        });
        
        // Show target step
        document.getElementById(`step${step}`).classList.add('active');
        
        // Update step indicators
        document.querySelectorAll('.checkout-step-indicator').forEach(indicator => {
            const indicatorStep = parseInt(indicator.dataset.step);
            indicator.classList.remove('active', 'completed');
            
            if (indicatorStep === step) {
                indicator.classList.add('active');
            } else if (indicatorStep < step) {
                indicator.classList.add('completed');
            }
        });
        
        currentStep = step;
        
        // Load step content
        if (step === 4) {
            loadOrderSummary();
        }
        
        // Restaurar opacidade
        const newActiveContent = document.querySelector('.checkout-step.active .checkout-content');
        if (newActiveContent) {
            newActiveContent.style.opacity = '1';
            newActiveContent.style.pointerEvents = 'auto';
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
}

// ===================================
// LOAD CART ITEMS
// ===================================

function loadCheckoutCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('checkoutCartItems');
    const sidebarItemsContainer = document.getElementById('sidebarItems');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <h3>Seu carrinho está vazio</h3>
                <p>Adicione produtos para continuar</p>
                <a href="produtos.html" class="btn btn-primary">Ver Produtos</a>
            </div>
        `;
        return;
    }
    
    // Main cart display
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="checkout-cart-item">
            ${item.image 
                ? `<img src="${item.image}" alt="${item.name}" class="checkout-item-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                   <div class="checkout-item-image-placeholder" style="display: none;">
                       <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffbdbd" stroke-width="1.5">
                           <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                           <circle cx="12" cy="12" r="3"></circle>
                       </svg>
                   </div>`
                : `<div class="checkout-item-image-placeholder">
                       <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffbdbd" stroke-width="1.5">
                           <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                           <circle cx="12" cy="12" r="3"></circle>
                       </svg>
                   </div>`
            }
            <div class="checkout-item-info">
                <div class="checkout-item-name">${item.name}</div>
                <div class="checkout-item-category">${item.category}</div>
                <div class="checkout-item-quantity">
                    <span>Quantidade: ${item.quantity}</span>
                </div>
            </div>
            <div class="checkout-item-price">
                R$ ${(item.price * item.quantity).toFixed(2)}
            </div>
            <button class="checkout-item-remove" onclick="removeItemFromCheckout(${item.id})">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `).join('');
    
    // Sidebar items
    sidebarItemsContainer.innerHTML = cart.map(item => `
        <div class="sidebar-item">
            <div>
                <div class="sidebar-item-name">${item.name}</div>
                <div class="sidebar-item-quantity">${item.quantity}x R$ ${item.price.toFixed(2)}</div>
            </div>
            <div class="sidebar-item-price">R$ ${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');
    
    // Update totals
    updateCheckoutTotals();
}

function removeItemFromCheckout(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count in header
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
    
    loadCheckoutCart();
}

function updateCheckoutTotals() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    document.getElementById('sidebarTotal').textContent = formatPrice(total);
}

// ===================================
// ORDER SUMMARY
// ===================================

function loadOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Personal data
    document.getElementById('summaryPersonal').innerHTML = `
        <div><strong>Nome:</strong> ${checkoutData.customer.name}</div>
        <div><strong>Telefone:</strong> ${checkoutData.customer.phone}</div>
        ${checkoutData.customer.email ? `<div><strong>E-mail:</strong> ${checkoutData.customer.email}</div>` : ''}
    `;
    
    // Address
    document.getElementById('summaryAddress').innerHTML = `
        <div>${checkoutData.address.street}, ${checkoutData.address.number}</div>
        <div>${checkoutData.address.neighborhood} - ${checkoutData.address.city}</div>
        ${checkoutData.address.complement ? `<div>${checkoutData.address.complement}</div>` : ''}
    `;
    
    // Products
    document.getElementById('summaryProducts').innerHTML = cart.map(item => `
        <div class="summary-product-item">
            <div>
                <div class="summary-product-name">${item.name}</div>
                <div class="summary-product-quantity">${item.quantity}x R$ ${item.price.toFixed(2)}</div>
            </div>
            <div class="summary-product-price">R$ ${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');
    
    // Total
    document.getElementById('summaryTotal').textContent = formatPrice(total);
}

// ===================================
// FINALIZE ORDER - WhatsApp Integration
// ===================================

function finalizeOrder() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Build WhatsApp message
    let message = `*🎁 NOVO PEDIDO - Presentes Especiais*\n\n`;
    message += `*👤 CLIENTE*\n`;
    message += `Nome: ${checkoutData.customer.name}\n`;
    message += `Telefone: ${checkoutData.customer.phone}\n`;
    if (checkoutData.customer.email) {
        message += `E-mail: ${checkoutData.customer.email}\n`;
    }
    
    message += `\n*📍 ENDEREÇO DE ENTREGA*\n`;
    message += `${checkoutData.address.street}, ${checkoutData.address.number}\n`;
    message += `${checkoutData.address.neighborhood} - ${checkoutData.address.city}\n`;
    if (checkoutData.address.complement) {
        message += `Complemento: ${checkoutData.address.complement}\n`;
    }
    
    message += `\n*🛍️ PRODUTOS*\n`;
    cart.forEach(item => {
        message += `\n• ${item.name}\n`;
        message += `  Quantidade: ${item.quantity}\n`;
        message += `  Preço unitário: R$ ${item.price.toFixed(2)}\n`;
        message += `  Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\n*💰 VALOR TOTAL: R$ ${total.toFixed(2)}*\n`;
    message += `\n_Aguardo confirmação e informações sobre o pagamento. Obrigado! 😊_`;
    
    // Save order to localStorage
    const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        customer: checkoutData.customer,
        address: checkoutData.address,
        items: cart,
        total: total
    };
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // WhatsApp number (replace with your actual number)
    const whatsappNumber = '5511987654321'; // Format: country code + area code + number
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Clear cart
    localStorage.removeItem('cart');
    
    // Show success message and redirect
    setTimeout(() => {
        alert('Pedido enviado! Você será redirecionado para a página inicial.');
        window.location.href = 'index.html';
    }, 1000);
}

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    loadCheckoutCart();
    
    // Load saved data if exists
    const savedData = sessionStorage.getItem('checkoutData');
    if (savedData) {
        checkoutData = JSON.parse(savedData);
        
        // Fill forms
        if (checkoutData.customer.name) {
            document.getElementById('customerName').value = checkoutData.customer.name;
            document.getElementById('customerPhone').value = checkoutData.customer.phone;
            document.getElementById('customerEmail').value = checkoutData.customer.email || '';
        }
        
        if (checkoutData.address.street) {
            document.getElementById('addressStreet').value = checkoutData.address.street;
            document.getElementById('addressNumber').value = checkoutData.address.number;
            document.getElementById('addressNeighborhood').value = checkoutData.address.neighborhood;
            document.getElementById('addressCity').value = checkoutData.address.city;
            document.getElementById('addressComplement').value = checkoutData.address.complement || '';
        }
    }
    
    // ===================================
    // FORM HANDLERS
    // ===================================
    
    // Personal Data Form
    const personalDataForm = document.getElementById('personalDataForm');
    if (personalDataForm) {
        personalDataForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validação básica
            const name = document.getElementById('customerName').value.trim();
            const phone = document.getElementById('customerPhone').value.trim();
            
            if (!name || !phone) {
                alert('Por favor, preencha nome e telefone.');
                return;
            }
            
            checkoutData.customer = {
                name: name,
                phone: phone,
                email: document.getElementById('customerEmail').value.trim()
            };
            
            // Salvar no sessionStorage
            sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
            console.log('✅ Dados pessoais salvos:', checkoutData.customer);
            
            // Avançar para próxima etapa
            goToStep(3);
        });
    }
    
    // Address Form
    const addressForm = document.getElementById('addressForm');
    if (addressForm) {
        addressForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validação básica
            const street = document.getElementById('addressStreet').value.trim();
            const number = document.getElementById('addressNumber').value.trim();
            const neighborhood = document.getElementById('addressNeighborhood').value.trim();
            const city = document.getElementById('addressCity').value.trim();
            
            if (!street || !number || !neighborhood || !city) {
                alert('Por favor, preencha todos os campos obrigatórios do endereço.');
                return;
            }
            
            checkoutData.address = {
                street: street,
                number: number,
                neighborhood: neighborhood,
                city: city,
                complement: document.getElementById('addressComplement').value.trim()
            };
            
            // Salvar no sessionStorage
            sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
            console.log('✅ Endereço salvo:', checkoutData.address);
            
            // Avançar para próxima etapa
            goToStep(4);
        });
    }
});

// Save checkout data to session storage
window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
});

// Make functions and data global
window.goToStep = goToStep;
window.removeItemFromCheckout = removeItemFromCheckout;
window.finalizeOrder = finalizeOrder;
window.checkoutData = checkoutData; // Exportar checkoutData globalmente
