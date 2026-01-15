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

// Auto login
if (checkAuth()) {
    document.getElementById('loginScreen')?.classList.add('hidden');
    document.getElementById('adminPanel')?.classList.remove('hidden');
    loadAdminData();
}

// ===================================
// PRODUCTS MANAGEMENT
// ===================================

let adminProducts = [];
let editingProductId = null;

// 🔥 USANDO SEMPRE window.API_URL 🔥
async function loadProductsFromAPI() {
    try {
        const response = await fetch(window.API_URL);
        if (!response.ok) throw new Error('Erro na API');
        adminProducts = await response.json();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        adminProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
    }
}

function loadProducts() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    if (adminProducts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">Nenhum produto cadastrado</td></tr>';
        return;
    }

    tbody.innerHTML = adminProducts.map(product => `
        <tr>
            <td><img src="${product.image || ''}" class="product-thumb"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>R$ ${product.price.toFixed(2)}</td>
            <td>
                <button onclick="editProduct(${product.id})">Editar</button>
                <button onclick="deleteProduct(${product.id})">Excluir</button>
            </td>
        </tr>
    `).join('');
}

function deleteProduct(id) {
    if (!confirm('Deseja excluir este produto?')) return;

    fetch(`${window.API_URL}/${id}`, { method: 'DELETE' })
        .then(res => {
            if (!res.ok) throw new Error();
            adminProducts = adminProducts.filter(p => p.id !== id);
            loadProducts();
            updateDashboard();
        })
        .catch(() => alert('Erro ao excluir produto'));
}

document.getElementById('productForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const productData = {
        name: productName.value,
        category: productCategory.value,
        price: parseFloat(productPrice.value),
        description: productDescription.value,
        image: productImage.value,
        featured: productFeatured.checked
    };

    const url = editingProductId
        ? `${window.API_URL}/${editingProductId}`
        : window.API_URL;

    const method = editingProductId ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });

        if (!res.ok) throw new Error();

        await loadProductsFromAPI();
        loadProducts();
        updateDashboard();
        closeProductModal();
    } catch {
        alert('Erro ao salvar produto');
    }
});

// ===================================
// DASHBOARD
// ===================================

function updateDashboard() {
    document.getElementById('totalProducts') &&
        (totalProducts.textContent = adminProducts.length);
}

// ===================================
// INIT
// ===================================

async function loadAdminData() {
    await loadProductsFromAPI();
    loadProducts();
    updateDashboard();
}

setInterval(async () => {
    await loadProductsFromAPI();
    loadProducts();
}, 5000);

// Expor funções
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.logout = logout;
