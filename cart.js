function loadCartItems() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="alert alert-info">Your cart is empty. <a href="products.html">Start shopping</a></div>';
        updateCartTotals();
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="card mb-3 cart-item" data-id="${item.id}">
            <div class="row g-0">
                <div class="col-md-2">
                    <img src="${item.image}" class="img-fluid rounded-start" alt="${item.name}">
                </div>
                <div class="col-md-10">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-md-4">
                                <h5 class="card-title">${item.name}</h5>
                                <p class="card-text text-muted">$${item.price.toFixed(2)} each</p>
                            </div>
                            <div class="col-md-2">
                                <div class="input-group quantity-input-group">
                                    <button class="btn btn-outline-secondary btn-sm decrement">-</button>
                                    <input type="number" class="form-control form-control-sm text-center quantity-input" value="${item.quantity}" min="1" max="${item.stock}">
                                    <button class="btn btn-outline-secondary btn-sm increment">+</button>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <span class="fw-bold">$${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                            <div class="col-md-2">
                                <button class="btn btn-outline-danger btn-sm remove-item">
                                    <i class="bi bi-trash"></i> Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Attach event listeners
    attachCartEvents();
    updateCartTotals();
}

function attachCartEvents() {
    // Quantity increment/decrement
    document.querySelectorAll('.increment').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            const max = parseInt(input.getAttribute('max'));
            let val = parseInt(input.value) + 1;
            if (val <= max) {
                input.value = val;
                updateCartItem(input);
            }
        });
    });
    
    document.querySelectorAll('.decrement').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            let val = parseInt(input.value) - 1;
            if (val >= 1) {
                input.value = val;
                updateCartItem(input);
            }
        });
    });
    
    // Quantity input change
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            let val = parseInt(this.value);
            const max = parseInt(this.getAttribute('max'));
            if (isNaN(val) || val < 1) val = 1;
            if (val > max) val = max;
            this.value = val;
            updateCartItem(this);
        });
    });
    
    // Remove item
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.cart-item');
            const id = parseInt(card.dataset.id);
            removeFromCart(id);
        });
    });
}

function updateCartItem(inputElement) {
    const card = inputElement.closest('.cart-item');
    const id = parseInt(card.dataset.id);
    const newQuantity = parseInt(inputElement.value);
    
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        loadCartItems(); // refresh
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    loadCartItems();
    showToast('Item removed from cart', 'info');
}

function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 5.99 : 0;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;
    
    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-shipping').textContent = shipping === 0 ? '$0.00' : `$${shipping.toFixed(2)}`;
    document.getElementById('cart-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadCartItems);
