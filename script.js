const bilder = [
  'img/DSC04682.JPG',
  'img/DJI_0225.JPG',
  'img/DSC04645.JPG',
  'img/DSC04510.JPG',
  'img/DSC04559.JPG',
  'img/DSC04566.JPG',
  'img/DSC04644.JPG',
  'img/DSC04584.JPG',
  'img/DSC04574.JPG'
];

let currentIndex = 0;
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
  // DOM-Elemente holen
  const gallery = document.querySelector('.gallery');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const leftArrow = document.querySelector('.lightbox-left');
  const rightArrow = document.querySelector('.lightbox-right');

  // Bilder in Galerie einfügen
  bilder.forEach((pfad, index) => {
    const img = document.createElement('img');
    img.src = pfad;
    img.alt = `Foto ${index + 1}`;
    img.classList.add('thumbnail');

    img.addEventListener('click', () => {
      currentIndex = index;
      showImage();
      lightbox.style.display = 'flex'; 
    });

    gallery.appendChild(img);
  }); 

  // Eventlistener für Lightbox-Pfeile
  leftArrow.addEventListener('click', prevImage);
  rightArrow.addEventListener('click', nextImage);

  // ESC-Taste schließt Lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // Klick außerhalb Bild schließt Lightbox
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Warenkorb aus LocalStorage laden
  loadCart();

  // Eventlistener für alle "In den Warenkorb"-Buttons
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const name = button.getAttribute('data-name');
      const price = parseFloat(button.getAttribute('data-price'));
      addToCart(name, price);
    });
  });

  // Warenkorb leeren Button Event
  const clearBtn = document.getElementById('clear-cart');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      cart = [];
      saveCart();
      renderCart();
      updateCartCount();
    });
  }
});

// Lightbox Funktionen
function showImage() {
  const lightboxImg = document.getElementById('lightbox-img');
  lightboxImg.src = bilder[currentIndex];
}

function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
}

function nextImage() {
  currentIndex = (currentIndex + 1) % bilder.length;
  showImage();
}

function prevImage() {
  currentIndex = (currentIndex - 1 + bilder.length) % bilder.length;
  showImage();
}

// Warenkorb Funktionen
function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  saveCart();
  renderCart();
  updateCartCount();
}

function renderCart() {
  const cartList = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");
  cartList.innerHTML = '0';

  let total = 0;
  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} x ${item.qty} - ${(item.price * item.qty).toFixed(2)} €`;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '×';
    removeBtn.title = "Artikel entfernen";
    removeBtn.style.marginLeft = '10px';
    removeBtn.onclick = () => removeFromCart(item.name);

    li.appendChild(removeBtn);
    cartList.appendChild(li);

    total += item.price * item.qty;
  });

  totalEl.textContent = total.toFixed(2);
}

function updateCartCount() {
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountEl.textContent = count;
  }
}

function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  saveCart();
  renderCart();
  updateCartCount();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
  const stored = localStorage.getItem("cart");
  cart = stored ? JSON.parse(stored) : [];
  renderCart();
  updateCartCount();
}

function toggleCart() {
  const cartEl = document.getElementById('cart');
  if (cartEl.style.display === 'block') {
    cartEl.style.display = 'none';
  } else {
    cartEl.style.display = 'block';
  }
}
