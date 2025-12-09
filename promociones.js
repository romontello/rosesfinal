// promociones.js
document.addEventListener("DOMContentLoaded", () => {
  const TEN_PCT_THRESHOLD = 30000;
  const applyTenCheckbox = document.getElementById('apply10');

  // Read products from HTML
  const productCards = Array.from(document.querySelectorAll('.producto-card'));
  const products = {};
  productCards.forEach(card => {
    const id = card.dataset.id;
    const price = Number(card.dataset.price);
    const name = card.querySelector('.producto-nombre').innerText;
    products[id] = { id, name, price };
  });

  const cart = {}; // productId -> qty

  // DOM refs
  const cartList = document.getElementById('cartList');
  const subtotalText = document.getElementById('subtotalText');
  const unitsDiscountText = document.getElementById('unitsDiscountText');
  const tenPctText = document.getElementById('tenPctText');
  const finalTotalText = document.getElementById('finalTotalText');

  const formatMoney = n => '$' + Number(n).toLocaleString('es-AR', { maximumFractionDigits: 0 });

  // Render cart list
  function renderCart() {
    cartList.innerHTML = '';
    const items = Object.entries(cart).filter(([_, q]) => q > 0);
    if (items.length === 0) {
      cartList.innerHTML = '<p class="empty-note">Aún no agregaste productos. Usa los botones o cambia cantidades.</p>';
      updateSummary(0,0,0,0);
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'cart-items';
    items.forEach(([id, qty]) => {
      const prod = products[id];
      const line = document.createElement('div');
      line.className = 'cart-item';
      line.innerHTML = `
        <div class="ci-left">
          <div class="ci-name">${prod.name}</div>
          <div class="ci-price">${formatMoney(prod.price)} x ${qty}</div>
        </div>
        <div class="ci-controls">
          <button class="qty-btn dec" data-id="${id}">-</button>
          <button class="qty-btn inc" data-id="${id}">+</button>
          <button class="remove-btn" data-id="${id}">Eliminar</button>
        </div>
      `;
      wrapper.appendChild(line);
    });
    cartList.appendChild(wrapper);

    // Attach handlers
    cartList.querySelectorAll('.qty-btn.inc').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.dataset.id;
        cart[id] = (cart[id] || 0) + 1;
        syncQtyInputs(id);
        recompute();
      });
    });
    cartList.querySelectorAll('.qty-btn.dec').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.dataset.id;
        cart[id] = Math.max(0, (cart[id] || 0) - 1);
        if (cart[id] === 0) delete cart[id];
        syncQtyInputs(id);
        recompute();
      });
    });
    cartList.querySelectorAll('.remove-btn').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.dataset.id;
        delete cart[id];
        syncQtyInputs(id, 0);
        recompute();
      });
    });
  }

  // Keep the qty inputs in grid synced with cart
  function syncQtyInputs(productId, forcedValue) {
    const input = document.querySelector(`.qty-input[data-product="${productId}"]`);
    if (!input) return;
    const val = (forcedValue !== undefined) ? forcedValue : (cart[productId] || 0);
    input.value = val;
  }

  // Click + button on product card
  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.dataset.product;
      cart[pid] = (cart[pid] || 0) + 1;
      syncQtyInputs(pid);
      renderCart();
      recompute();
    });
  });

  // When user edits qty in the card
  document.querySelectorAll('.qty-input').forEach(input => {
    input.addEventListener('input', () => {
      const pid = input.dataset.product;
      let v = parseInt(input.value) || 0;
      if (v < 0) v = 0;
      if (v === 0) delete cart[pid];
      else cart[pid] = v;
      renderCart();
      recompute();
    });
  });

  // Clear
  const clearBtn = document.getElementById('clearBtn');
  clearBtn.addEventListener('click', () => {
    Object.keys(cart).forEach(k => delete cart[k]);
    document.querySelectorAll('.qty-input').forEach(i => i.value = 0);
    renderCart();
    recompute();
  });

  // Checkout demo
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    alert('Simulación de checkout. Total a pagar: ' + finalTotalText.innerText);
  });

  // Recompute totals & discounts
  function recompute() {
    const entries = Object.entries(cart).filter(([_,q]) => q > 0);
    let subtotal = 0;
    let unitsDiscountTotal = 0;

    entries.forEach(([id, qty]) => {
      const prod = products[id];
      const price = prod.price;
      subtotal += price * qty;

      // discounts per product
      const pairs = Math.floor(qty / 2);
      const discountPairs = pairs * (price * 0.5);

      const trios = Math.floor(qty / 3);
      const discount3x2 = trios * price;

      // choose best (no double-applied per same units)
      const best = Math.max(discountPairs, discount3x2);
      unitsDiscountTotal += best;
    });

    const subtotalAfterUnits = subtotal - unitsDiscountTotal;

    let tenPctDiscount = 0;
    if (applyTenCheckbox.checked && subtotalAfterUnits > TEN_PCT_THRESHOLD) {
      tenPctDiscount = subtotalAfterUnits * 0.10;
    }

    const finalTotal = subtotalAfterUnits - tenPctDiscount;
    updateSummary(subtotal, unitsDiscountTotal, tenPctDiscount, finalTotal);
    renderCart();
  }

  function updateSummary(subtotal = 0, unitsDiscount = 0, tenPct = 0, final = 0) {
    subtotalText.textContent = formatMoney(Math.round(subtotal));
    unitsDiscountText.textContent = '-' + formatMoney(Math.round(unitsDiscount));
    tenPctText.textContent = '-' + formatMoney(Math.round(tenPct));
    finalTotalText.textContent = formatMoney(Math.round(final));
  }

  applyTenCheckbox.addEventListener('change', recompute);

  // Init
  renderCart();
  recompute();
});


