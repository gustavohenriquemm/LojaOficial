// ===================================
// CONFIGURAÇÃO DA API (ÚNICA)
// ===================================

const BACKEND_URL = 'https://lojaoficial-3.onrender.com';
const API_URL = `${BACKEND_URL}/api/products`;

console.log('API configurada:', API_URL);

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
    if (
        username === ADMIN_CREDENTIALS.username &&
        password === ADMIN_CREDENTIALS.password
    ) {
        localStorage.setItem('adminLoggedIn', 'true');
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem('adminLoggedIn');
    location.reload();
}

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

async function loadProductsFromAPI() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao buscar produtos');
        adminProducts = await response.json();
    } catch (error) {
        console.error('Erro API:', error);
        adminProducts = JSON.parse(localStorage.getItem('adminProducts')) || [];
    }
}

function loadProducts() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    if (adminProducts.length === 0) {
        tbody.innerHTML =
            '<tr><td colspan="5">Nenhum produto cadastrado</td></tr>';
        return;
    }

    tbody.innerHTML = adminProducts.map(product => `
        <tr>
            <td>
                ${
                    product.image
                        ? `<img src="${product.image}" class="product-thumb">`
                        : 'Sem imagem'
                }
            </td>
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

async function deleteProduct(id) {
    if (!confirm('Deseja excluir este produto?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Erro ao excluir');

        adminProducts = adminProducts.filter(p => p.id !== id);
        loadProducts();
        alert('Produto excluído!');
    } catch (err) {
        alert('Erro ao excluir produto');
        console.error(err);
    }
}

document.getElementById('productForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const productData = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        image: document.getElementById('productImage').value || null
    };

    try {
        const response = editingProductId
            ? await fetch(`${API_URL}/${editingProductId}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(productData)
              })
            : await fetch(API_URL, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(productData)
              });

        if (!response.ok) throw new Error('Erro ao salvar');

        await loadProductsFromAPI();
        loadProducts();
        alert('Produto salvo!');
    } catch (err) {
        alert('Erro ao salvar produto');
        console.error(err);
    }
});

// ===================================
// DASHBOARD
// ===================================

function updateDashboard() {
    document.getElementById('totalProducts')?.textContent =
        adminProducts.length;
}

// ===================================
// INITIALIZATION
// ===================================

async function loadAdminData() {
    await loadProductsFromAPI();
    loadProducts();
    updateDashboard();
}

setInterval(async () => {
    await loadProductsFromAPI();
    loadProducts();
    updateDashboard();
}, 5000);

// ===================================
// GLOBAL FUNCTIONS
// ===================================

window.logout = logout;
window.deleteProduct = deleteProduct;
