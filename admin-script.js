// ===================================
// ADMIN AUTHENTICATION
// ===================================

const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

function checkAuth() {
    return localStorage.getItem('adminLoggedIn') === 'true';
}

function login(username, password) {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('adminLoggedIn', 'true');
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem('adminLoggedIn');
    location.reload();
}

// Login form handler
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('adminUser').value;
    const password = document.getElementById('adminPassword').value;
    
    if (login(username, password)) {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
        loadAdminData();
    } else {
        alert('Usuário ou senha incorretos!');
    }
});

// Check if already logged in
if (checkAuth()) {
    document.getElementById('loginScreen')?.classList.add('hidden');
    document.getElementById('adminPanel')?.classList.remove('hidden');
    loadAdminData();
}

// ===================================
// PRODUCTS MANAGEMENT
// ===================================

// Initialize variables
var adminProducts = [];
var editingProductId = null;

// Load products from storage
try {
    const stored = localStorage.getItem('adminProducts');
    if (stored) {
        adminProducts = JSON.parse(stored);
    }
} catch (e) {
    console.error('Error loading admin products:', e);
    adminProducts = [];
}

// Subcategories by main category
const subcategoriesByCategory = {
    'Cosmético Feminino': ['Perfumes', 'Cremes', 'Sabonetes', 'Body Splash', 'Esfoliantes', 'Outros Cuidados'],
    'Cosmético Masculino': ['Perfumes', 'Cremes', 'Sabonetes', 'Body Splash', 'Esfoliantes', 'Outros Cuidados']
};

// Update subcategory options based on selected category
function updateSubcategoryOptions() {
    const categorySelect = document.getElementById('productCategory');
    const subcategorySelect = document.getElementById('productSubcategory');
    
    const selectedCategory = categorySelect.value;
    
    if (!selectedCategory) {
        subcategorySelect.innerHTML = '<option value="">Selecione uma categoria principal primeiro</option>';
        subcategorySelect.disabled = true;
        return;
    }
    
    const subcategories = subcategoriesByCategory[selectedCategory] || [];
    subcategorySelect.disabled = false;
    subcategorySelect.innerHTML = '<option value="">Selecione...</option>' + 
        subcategories.map(sub => `<option value="${sub}">${sub}</option>`).join('');
}

function loadProducts() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    if (adminProducts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-message">Nenhum produto cadastrado</td></tr>';
        return;
    }

    tbody.innerHTML = adminProducts.map(product => `
        <tr>
            <td>
                ${product.image 
                    ? `<img src="${product.image}" alt="${product.name}" class="product-thumb" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect fill=%22%23f0f0f0%22 width=%22100%22 height=%22100%22/></svg>'">` 
                    : '<div class="product-thumb" style="display: flex; align-items: center; justify-content: center; background: #f0f0f0;">Sem imagem</div>'}
            </td>
            <td><strong>${product.name}</strong></td>
            <td>${product.category}${product.subcategory ? ' > ' + product.subcategory : ''}</td>
            <td><strong style="color: var(--primary-color)">R$ ${product.price.toFixed(2)}</strong></td>
            <td>
                <div class="table-actions">
                    <button class="action-btn action-btn-edit" onclick="editProduct(${product.id})">Editar</button>
                    <button class="action-btn action-btn-delete" onclick="deleteProduct(${product.id})">Excluir</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const modalTitle = document.getElementById('modalTitle');
    
    if (productId) {
        const product = adminProducts.find(p => p.id === productId);
        if (product) {
            modalTitle.textContent = 'Editar Produto';
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            
            // Update subcategory options and set value
            updateSubcategoryOptions();
            document.getElementById('productSubcategory').value = product.subcategory || '';
            
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productOldPrice').value = product.oldPrice || '';
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productImage').value = product.image || '';
            
            // Show image preview if exists
            if (product.image) {
                const preview = document.getElementById('imagePreview');
                const previewImg = document.getElementById('previewImg');
                previewImg.src = product.image;
                preview.style.display = 'block';
            }
            
            editingProductId = productId;
        }
    } else {
        modalTitle.textContent = 'Novo Produto';
        form.reset();
        document.getElementById('productId').value = '';
        document.getElementById('productImage').value = '';
        document.getElementById('imagePreview').style.display = 'none';
        editingProductId = null;
    }
    
    modal.classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    document.getElementById('productForm').reset();
    document.getElementById('productImageFile').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('imagePreview').style.display = 'none';
    editingProductId = null;
}

function editProduct(id) {
    openProductModal(id);
}

function deleteProduct(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        adminProducts = adminProducts.filter(p => p.id !== id);
        localStorage.setItem('adminProducts', JSON.stringify(adminProducts));
        
        // Sync with public products
        syncProducts();
        loadProducts();
        updateDashboard();
        alert('Produto excluído com sucesso!');
    }
}

// Product form submission
document.getElementById('productForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const subcategory = document.getElementById('productSubcategory').value;
    
    const productData = {
        id: editingProductId || Date.now(),
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        subcategory: subcategory || '',
        price: parseFloat(document.getElementById('productPrice').value),
        oldPrice: document.getElementById('productOldPrice').value ? parseFloat(document.getElementById('productOldPrice').value) : null,
        description: document.getElementById('productDescription').value,
        image: document.getElementById('productImage').value || null
    };
    
    if (editingProductId) {
        const index = adminProducts.findIndex(p => p.id === editingProductId);
        adminProducts[index] = productData;
    } else {
        adminProducts.push(productData);
    }
    
    localStorage.setItem('adminProducts', JSON.stringify(adminProducts));
    
    // Sync with public products
    syncProducts();
    
    closeProductModal();
    loadProducts();
    updateDashboard();
    alert('Produto salvo com sucesso!');
});

// Sync products to public site
function syncProducts() {
    // Update the products array in the main script
    localStorage.setItem('products', JSON.stringify(adminProducts));
}

// ===================================
// ORDERS MANAGEMENT
// ===================================

function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const recentOrdersList = document.getElementById('recentOrdersList');
    const ordersGrid = document.getElementById('ordersGrid');
    
    // Recent orders in dashboard
    if (recentOrdersList) {
        if (orders.length === 0) {
            recentOrdersList.innerHTML = '<p class="empty-message">Nenhum pedido registrado ainda</p>';
        } else {
            const recentOrders = orders.slice(-5).reverse();
            recentOrdersList.innerHTML = recentOrders.map(order => `
                <div class="order-item">
                    <div class="order-header">
                        <span class="order-id">Pedido #${order.id}</span>
                        <span class="order-date">${new Date(order.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div class="order-customer">${order.customer.name}</div>
                    <div class="order-total">R$ ${order.total.toFixed(2)}</div>
                </div>
            `).join('');
        }
    }
    
    // All orders in orders section
    if (ordersGrid) {
        if (orders.length === 0) {
            ordersGrid.innerHTML = '<p class="empty-message">Nenhum pedido registrado</p>';
        } else {
            ordersGrid.innerHTML = orders.slice().reverse().map(order => `
                <div class="order-card">
                    <div class="order-card-header">
                        <span class="order-card-title">Pedido #${order.id}</span>
                        <span class="order-card-date">${new Date(order.date).toLocaleString('pt-BR')}</span>
                    </div>
                    
                    <div class="order-card-info">
                        <div class="order-card-label">Cliente</div>
                        <div class="order-card-value">${order.customer.name}</div>
                    </div>
                    
                    <div class="order-card-info">
                        <div class="order-card-label">Telefone</div>
                        <div class="order-card-value">${order.customer.phone}</div>
                    </div>
                    
                    <div class="order-card-info">
                        <div class="order-card-label">Endereço</div>
                        <div class="order-card-value">
                            ${order.address.street}, ${order.address.number}<br>
                            ${order.address.neighborhood} - ${order.address.city}
                            ${order.address.complement ? '<br>' + order.address.complement : ''}
                        </div>
                    </div>
                    
                    <div class="order-card-products">
                        <h4>Produtos</h4>
                        ${order.items.map(item => `
                            <div class="order-product-item">
                                ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="order-card-total">
                        <span class="order-card-total-label">Total</span>
                        <span class="order-card-total-value">R$ ${order.total.toFixed(2)}</span>
                    </div>
                </div>
            `).join('');
        }
    }
}

// ===================================
// SALES MANAGEMENT
// ===================================

function updateSalesData() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const period = document.getElementById('salesPeriod')?.value || 'current';
    
    let filteredOrders = orders;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    if (period === 'current') {
        filteredOrders = orders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
        });
    } else if (period === 'last') {
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        filteredOrders = orders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear;
        });
    }
    
    const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const ordersCount = filteredOrders.length;
    const averageTicket = ordersCount > 0 ? totalSales / ordersCount : 0;
    
    // Update sales summary
    if (document.getElementById('salesTotal')) {
        document.getElementById('salesTotal').textContent = `R$ ${totalSales.toFixed(2)}`;
    }
    if (document.getElementById('salesCount')) {
        document.getElementById('salesCount').textContent = ordersCount;
    }
    if (document.getElementById('salesAverage')) {
        document.getElementById('salesAverage').textContent = `R$ ${averageTicket.toFixed(2)}`;
    }
    
    // Update sales table
    const salesTableBody = document.getElementById('salesTableBody');
    if (salesTableBody) {
        if (filteredOrders.length === 0) {
            salesTableBody.innerHTML = '<tr><td colspan="4" class="empty-message">Nenhuma venda registrada</td></tr>';
        } else {
            salesTableBody.innerHTML = filteredOrders.slice().reverse().map(order => `
                <tr>
                    <td>${new Date(order.date).toLocaleDateString('pt-BR')}</td>
                    <td>${order.customer.name}</td>
                    <td>${order.items.length} produto(s)</td>
                    <td><strong style="color: var(--primary-color)">R$ ${order.total.toFixed(2)}</strong></td>
                </tr>
            `).join('');
        }
    }
}

// ===================================
// DASHBOARD
// ===================================

function updateDashboard() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });
    
    const monthRevenue = monthOrders.reduce((sum, order) => sum + order.total, 0);
    
    // Update stats
    if (document.getElementById('totalProducts')) {
        document.getElementById('totalProducts').textContent = adminProducts.length;
    }
    if (document.getElementById('totalOrders')) {
        document.getElementById('totalOrders').textContent = monthOrders.length;
    }
    if (document.getElementById('totalRevenue')) {
        document.getElementById('totalRevenue').textContent = `R$ ${monthRevenue.toFixed(2)}`;
    }
}

// ===================================
// NAVIGATION
// ===================================

function showSection(sectionName) {
    // Update nav buttons
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.admin-nav-btn').classList.add('active');
    
    // Update sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const sectionId = sectionName + 'Section';
    document.getElementById(sectionId)?.classList.add('active');
    
    // Load section data
    if (sectionName === 'sales') {
        updateSalesData();
    } else if (sectionName === 'orders') {
        loadOrders();
    }
}

// ===================================
// INITIALIZATION
// ===================================

function loadAdminData() {
    // Sync products from localStorage - admin products always override
    const storedProducts = localStorage.getItem('products');
    const storedAdminProducts = localStorage.getItem('adminProducts');
    
    if (storedAdminProducts) {
        adminProducts = JSON.parse(storedAdminProducts);
    } else if (storedProducts) {
        adminProducts = JSON.parse(storedProducts);
        localStorage.setItem('adminProducts', JSON.stringify(adminProducts));
    } else {
        // If no products exist, create empty array but sync with script.js defaults
        adminProducts = [];
        // Check if script.js has default products
        setTimeout(() => {
            const defaultProducts = localStorage.getItem('products');
            if (defaultProducts) {
                adminProducts = JSON.parse(defaultProducts);
                localStorage.setItem('adminProducts', JSON.stringify(adminProducts));
                loadProducts();
                updateDashboard();
            }
        }, 100);
    }
    
    // Always sync to ensure consistency
    if (adminProducts.length > 0) {
        syncProducts();
    }
    
    loadProducts();
    loadOrders();
    updateDashboard();
    updateSalesData();
}

// Listen for storage changes from other tabs/windows
window.addEventListener('storage', (e) => {
    if (e.key === 'orders') {
        loadOrders();
        updateDashboard();
        updateSalesData();
    }
});

// ===================================
// IMAGE UPLOAD HANDLER
// ===================================

function handleImageUpload(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert('A imagem é muito grande! Tamanho máximo: 2MB');
        event.target.value = '';
        return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem!');
        event.target.value = '';
        return;
    }
    
    // Read and convert to base64
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const base64Image = e.target.result;
        
        // Store in hidden input
        document.getElementById('productImage').value = base64Image;
        
        // Show preview
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
        
        previewImg.src = base64Image;
        preview.style.display = 'block';
    };
    
    reader.onerror = function() {
        alert('Erro ao carregar a imagem. Tente novamente.');
        event.target.value = '';
    };
    
    reader.readAsDataURL(file);
}

function removeImage() {
    document.getElementById('productImageFile').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('previewImg').src = '';
}

// Close modal when clicking outside
document.getElementById('productModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'productModal') {
        closeProductModal();
    }
});

// Make functions global
window.showSection = showSection;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.logout = logout;
window.updateSalesData = updateSalesData;
window.updateSubcategoryOptions = updateSubcategoryOptions;
window.handleImageUpload = handleImageUpload;
window.removeImage = removeImage;
