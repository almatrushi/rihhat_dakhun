const DEFAULT_PRODUCTS = [
  {
    id: crypto.randomUUID(),
    name: "مجموعة عناية بالبشرة",
    price: 320,
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    description: "تركيبة طبيعية تمنحك إشراقة يومية مع ترطيب عميق.",
    badge: "الأكثر مبيعاً",
  },
  {
    id: crypto.randomUUID(),
    name: "سماعات لاسلكية",
    price: 540,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    description: "صوت نقي مع عزل للضوضاء وبطارية تدوم طويلاً.",
    badge: "عرض محدود",
  },
  {
    id: crypto.randomUUID(),
    name: "دفتر تخطيط فاخر",
    price: 110,
    image:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80",
    description: "نظم مهامك وأهدافك مع تصميم أنيق وأوراق عالية الجودة.",
    badge: "جديد",
  },
];

const STORAGE_KEY = "rihhat_products";

const getStoredProducts = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
  }
  try {
    return JSON.parse(stored);
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
  }
};

const setStoredProducts = (products) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

const formatPrice = (price) => `${price} ر.س`;

const createProductCard = (product) => {
  const card = document.createElement("article");
  card.className = "product-card";

  const badge = product.badge
    ? `<span class="badge">${product.badge}</span>`
    : "";

  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}" loading="lazy" />
    <div class="product-body">
      <div class="product-meta">
        <h3>${product.name}</h3>
        ${badge}
      </div>
      <p>${product.description}</p>
      <div class="product-footer">
        <span class="price">${formatPrice(product.price)}</span>
        <button class="button ghost">أضف للسلة</button>
      </div>
    </div>
  `;

  return card;
};

const renderProducts = (containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  const products = getStoredProducts();
  container.innerHTML = "";

  if (!products.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "لا توجد منتجات حالياً، أضف منتجاً جديداً من لوحة الإدارة.";
    container.appendChild(empty);
    return;
  }

  products.forEach((product) => {
    container.appendChild(createProductCard(product));
  });
};

const form = document.getElementById("product-form");
const message = document.getElementById("form-message");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const newProduct = {
      id: crypto.randomUUID(),
      name: formData.get("name").trim(),
      price: Number(formData.get("price")),
      image: formData.get("image").trim(),
      description: formData.get("description").trim(),
      badge: "تمت إضافته الآن",
    };

    const products = getStoredProducts();
    products.unshift(newProduct);
    setStoredProducts(products);

    form.reset();
    if (message) {
      message.textContent = "تمت إضافة المنتج بنجاح!";
    }
    renderProducts("admin-products");
  });
}

renderProducts("products");
renderProducts("admin-products");
