const productsData = [
  { id: 1, name: "Painel Fotovoltaico Quântico 550W", category: "solar", price: 1290.00, icon: "fa-solar-panel", tag: "99.2% Eficiência", description: "Célula Monocristalina tratada com filme de perovskita para absorção máxima de fótons." },
  { id: 2, name: "Bateria de Lítio EcoWall 10kWh", category: "battery", price: 14500.00, icon: "fa-car-battery", tag: "10 Anos Garantia", description: "Armazenamento residencial inteligente com ciclo de vida ultra-longo." },
  { id: 3, name: "Microturbina Eólica AeroX 1.5kW", category: "wind", price: 3890.00, icon: "fa-wind", tag: "Ultra Silenciosa", description: "Design aerodinâmico helicoidal ideal para áreas urbanas e ventos fracos." },
  { id: 4, name: "Carregador EV Ultra-Rápido 22kW", category: "ev", price: 4200.00, icon: "fa-charging-station", tag: "Smart App Control", description: "Estação de recarga para veículos elétricos alimentada por energia solar direta." },
  { id: 5, name: "Inversor Híbrido EcoGrid 8kW", category: "solar", price: 5600.00, icon: "fa-bolt", tag: "IA Integrada", description: "Gerenciamento inteligente de fluxo de carga entre rede, baterias e consumo local." },
  { id: 6, name: "Gerador Portátil Solar Trekker", category: "battery", price: 2100.00, icon: "fa-plug", tag: "Portátil", description: "Maleta com mini painel e tomadas AC/DC para expedições e emergências." }
];

// Carrinho persistente no navegador (localStorage)
let cart = JSON.parse(localStorage.getItem('ecotech_cart')) || [];
let currentCategory = 'all';

function saveCart() {
  localStorage.setItem('ecotech_cart', JSON.stringify(cart));
  updateNavBadge();
}

function updateNavBadge() {
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  document.querySelectorAll('#navCartCount').forEach(badge => {
    badge.textContent = totalCount;
  });
}

// Menu Mobile Toggle
const mobileToggle = document.getElementById('mobileToggle');
const mainNav = document.getElementById('mainNav');
if (mobileToggle && mainNav) {
  mobileToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    const icon = mobileToggle.querySelector('i');
    icon.className = mainNav.classList.contains('active') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  });
}

// Renderização de Produtos (Página produtos.html)
const productsGrid = document.getElementById('productsGrid');
if (productsGrid) {
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const filterBtns = document.querySelectorAll('.filter-btn');

  function renderProducts(items) {
    productsGrid.innerHTML = '';
    if (items.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">
          <i class="fa-solid fa-microchip" style="font-size: 2.5rem; margin-bottom: 10px; color: var(--neon-cyan);"></i>
          <p>Nenhum componente encontrado na matriz de busca.</p>
        </div>`;
      return;
    }

    items.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <span class="product-card__tag">${product.tag}</span>
        <div class="product-card__image"><i class="fa-solid ${product.icon}"></i></div>
        <h3 class="product-card__title">${product.name}</h3>
        <p class="product-card__description">${product.description}</p>
        <div class="product-card__footer">
          <span class="product-card__price">R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          <button class="product-card__add-btn" onclick="addToCart(${product.id})" aria-label="Adicionar">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      `;
      productsGrid.appendChild(card);
    });
  }

  function filterProducts() {
    const query = searchInput.value.toLowerCase().trim();
    if (clearSearchBtn) clearSearchBtn.style.display = query.length > 0 ? 'block' : 'none';

    const filtered = productsData.filter(product => {
      const matchesCategory = (currentCategory === 'all') || (product.category === currentCategory);
      const matchesSearch = product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
    renderProducts(filtered);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      filterProducts();
    });
  });

  if (searchInput) searchInput.addEventListener('input', filterProducts);
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      filterProducts();
      searchInput.focus();
    });
  }

  renderProducts(productsData);
}

// Ações do Carrinho
window.addToCart = function(id) {
  const product = productsData.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  alert(`"${product.name}" adicionado à aquisição!`);
};

const cartItemsContainer = document.getElementById('cartItemsContainer');
if (cartItemsContainer) {
  function renderCartPage() {
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 40px;">Sua lista de aquisição está vazia.</p>`;
    } else {
      cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
          <div class="cart-item__icon"><i class="fa-solid ${item.icon}"></i></div>
          <div class="cart-item__details">
            <h4>${item.name}</h4>
            <small>R$ ${item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</small>
          </div>
          <div class="cart-item__controls">
            <button onclick="changeQuantity(${item.id}, -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="changeQuantity(${item.id}, 1)">+</button>
          </div>
        `;
        cartItemsContainer.appendChild(itemEl);
      });
    }

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const discount = subtotal * 0.05;
    const total = subtotal - discount;

    document.getElementById('cartSubtotal').textContent = `R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('cartDiscount').textContent = `- R$ ${discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('cartTotal').textContent = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }

  window.changeQuantity = function(id, change) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
    saveCart();
    renderCartPage();
  };

  renderCartPage();

  const checkoutBtn = document.getElementById('checkoutBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const closeModalBtn = document.getElementById('closeModalBtn');

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert("Adicione itens antes de prosseguir com a aquisição.");
        return;
      }
      modalOverlay.classList.add('active');
      cart = [];
      saveCart();
      renderCartPage();
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      window.location.href = 'produtos.html';
    });
  }
}

// Calculadora de Impacto
const billRange = document.getElementById('billRange');
const sunHours = document.getElementById('sunHours');
if (billRange && sunHours) {
  const billVal = document.getElementById('billVal');
  const sunVal = document.getElementById('sunVal');
  const resSavings = document.getElementById('resSavings');
  const resTrees = document.getElementById('resTrees');
  const resCO2 = document.getElementById('resCO2');

  function calculateEco() {
    const bill = parseFloat(billRange.value);
    const hours = parseFloat(sunHours.value);

    billVal.textContent = `R$ ${bill}`;
    sunVal.textContent = `${hours} hrs`;

    const yearlySavings = bill * 0.9 * 12;
    const trees = Math.round(yearlySavings / 225);
    const co2 = (yearlySavings / 3000).toFixed(1);

    resSavings.textContent = `R$ ${yearlySavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    resTrees.textContent = `${trees} Árvores`;
    resCO2.textContent = `${co2} Toneladas`;
  }

  billRange.addEventListener('input', calculateEco);
  sunHours.addEventListener('input', calculateEco);
  calculateEco();
}

updateNavBadge();


