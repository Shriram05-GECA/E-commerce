// Main JavaScript for E-Commerce Website

// Product Data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 89.99,
        oldPrice: 129.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        rating: 4.5,
        description: "Noise cancelling wireless headphones with 30hr battery life.",
        badge: "Sale",
        stock: 15
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 199.99,
        oldPrice: null,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        rating: 4.0,
        description: "Fitness tracker with heart rate monitor and GPS.",
        badge: "New",
        stock: 8
    },
    {
        id: 3,
        name: "Smart Speaker",
        price: 129.99,
        oldPrice: 179.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        rating: 5.0,
        description: "Voice-controlled speaker with premium sound quality.",
        badge: "Sale",
        stock: 12
    },
    {
        id: 4,
        name: "Running Shoes",
        price: 79.99,
        oldPrice: null,
        category: "fashion",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        rating: 4.5,
        description: "Lightweight running shoes with superior cushioning.",
        badge: null,
        stock: 20
    },
    {
        id: 5,
        name: "Smartphone",
        price: 699.99,
        oldPrice: null,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        rating: 4.0,
        description: "Latest model with dual camera and 128GB storage.",
        badge: null,
        stock: 5
    },
    {
        id: 6,
        name: "Laptop Backpack",
        price: 49.99,
        oldPrice: null,
        category: "fashion",
        image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        rating: 4.5,
        description: "Water-resistant backpack with laptop compartment.",
        badge: "Hot",
        stock: 25
    },
    {
        id: 7,
        name: "Sunglasses",
        price: 39.99,
        oldPrice: null,
        category: "fashion",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        rating: 5.0,
        description: "Polarized sunglasses with UV protection.",
        badge: null,
        stock: 30
    },
    {
        id: 8,
        name: "Digital Camera",
        price: 449.99,
        oldPrice: 599.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        rating: 4.5,
        description: "24MP digital camera with 4K video recording.",
        badge: "Sale",
        stock: 7
    }
];

// Load products for ticker
function loadProductTicker() {
    const tickerContent = document.querySelector('.ticker-content');
    if (!tickerContent) return;
    
    // Duplicate products for seamless scrolling
    const tickerProducts = [...products, ...products]; 
    tickerContent.innerHTML = tickerProducts.map(product => `
        <div class="ticker-item">
            <img src="${product.image}" alt="${product.name}">
            <span class="fw-bold me-2">${product.name}</span>
            <span class="text-warning">$${product.price}</span>
        </div>
    `).join('');
}

// Call in DOMContentLoaded
// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Load featured products on homepage
function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Get first 4 products
    const featured = products.slice(0, 4);
    
    featured.forEach(product => {
        const productCard = createProductCard(product);
        container.innerHTML += productCard;
    });
    
    // Add event listeners to Add to Cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            addToCart(productId);
        });
    });
}

// Create product card HTML
function createProductCard(product) {
    return `
        <div class="col-md-3">
            <div class="product-card">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <img src="${product.image}" class="product-img" alt="${product.name}">
                <div class="p-3">
                    <div class="product-rating mb-2">
                        ${getStarRating(product.rating)}
                        <small class="text-muted ms-1">(${product.rating})</small>
                    </div>
                    <h6 class="fw-bold">${product.name}</h6>
                    <p class="text-muted small mb-3">${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <span class="product-price">$${product.price.toFixed(2)}</span>
                            ${product.oldPrice ? `<span class="product-old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                        </div>
                        <button class="btn btn-primary btn-sm add-to-cart" data-id="${product.id}">
                            <i class="bi bi-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Get star rating HTML
function getStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="bi bi-star-fill"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="bi bi-star-half"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="bi bi-star"></i>';
    }
    
    return stars;
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            showToast('Stock limit reached!', 'warning');
            return;
        }
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartCount();
    saveCart();
    showToast('Product added to cart!', 'success');
}

// Update cart count in navbar
function updateCartCount() {
    const countElements = document.querySelectorAll('#cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    countElements.forEach(element => {
        element.textContent = totalItems;
        if (totalItems === 0) {
            element.classList.add('d-none');
        } else {
            element.classList.remove('d-none');
        }
    });
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Show toast notification
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${type} border-0`;
    toast.id = toastId;
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Show toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Update wishlist count
    const wishlistCount = wishlist.length;
    document.querySelectorAll('#wishlist-count').forEach(element => {
        element.textContent = wishlistCount;
        if (wishlistCount === 0) {
            element.classList.add('d-none');
        } else {
            element.classList.remove('d-none');
        }
    });
    
    // Scroll animations
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
});
