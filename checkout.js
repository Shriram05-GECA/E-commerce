// Checkout steps
let currentStep = 1;

function showStep(step) {
    document.getElementById('step1').style.display = step === 1 ? 'block' : 'none';
    document.getElementById('step2').style.display = step === 2 ? 'block' : 'none';
    document.getElementById('step3').style.display = step === 3 ? 'block' : 'none';
    
    // Update progress indicators
    document.querySelectorAll('.checkout-step').forEach((el, index) => {
        el.classList.remove('active', 'completed');
        if (index + 1 < step) el.classList.add('completed');
        if (index + 1 === step) el.classList.add('active');
    });
}

// Step navigation
document.getElementById('continueToPayment').addEventListener('click', function() {
    // Validate shipping form
    const form = document.getElementById('shippingForm');
    if (form.checkValidity()) {
        currentStep = 2;
        showStep(2);
    } else {
        form.classList.add('was-validated');
    }
});

document.getElementById('continueToConfirm').addEventListener('click', function() {
    currentStep = 3;
    showStep(3);
    // Populate review data
    // ...
});

document.getElementById('backToShipping').addEventListener('click', function() {
    currentStep = 1;
    showStep(1);
});

document.getElementById('backToPayment').addEventListener('click', function() {
    currentStep = 2;
    showStep(2);
});

document.getElementById('placeOrder').addEventListener('click', function() {
    // Clear cart, show success, redirect
    cart = [];
    saveCart();
    updateCartCount();
    alert('Order placed successfully! Thank you for shopping with ShopEasy.');
    window.location.href = 'index.html';
});

// Load order summary
function loadCheckoutSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 5.99 : 0;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;
    
    document.getElementById('checkout-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('checkout-shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('checkout-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('checkout-total').textContent = `$${total.toFixed(2)}`;
    
    const itemsHtml = cart.map(item => `
        <div class="d-flex justify-content-between mb-2">
            <span>${item.name} x ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    document.getElementById('checkout-summary-items').innerHTML = itemsHtml;
    document.getElementById('reviewItems').innerHTML = itemsHtml;
}

document.addEventListener('DOMContentLoaded', function() {
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    showStep(1);
    loadCheckoutSummary();
});
