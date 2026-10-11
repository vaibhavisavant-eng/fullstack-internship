# 🛒 LuxeShop — E-Commerce Landing Page

A modern, fully responsive e-commerce landing page built with **HTML5**, **CSS3**, **Bootstrap 5** (CDN), and **Vanilla JavaScript**. No build tools needed — just open and go.

---

## 📁 Project Structure

```
task2/
├── index.html   # Full page — all sections
├── style.css    # Dark theme, component styles, animations
├── script.js    # Cart, filters, countdown, validation, toasts
└── README.md    # This file
```

---

## ✨ Features

| Feature | Description |
|---|---|
| **Announcement Bar** | Dismissable top promo bar with a coupon code chip |
| **Navbar** | Glassmorphic sticky navbar, logo, nav links, search, wishlist, cart icon with live item count badge |
| **Cart Sidebar** | Slide-in cart panel with add/remove, quantity controls, running total, and `localStorage` persistence |
| **Hero Banner** | Gradient headline, offer badge, trust badges, floating stat cards, animated entry |
| **Category Pills** | Filter products by All / Electronics / Fashion / Lifestyle / Fitness with smooth transitions |
| **Products Grid** | 6 product cards — image, category, name, star rating, price (with/without strikethrough), Add to Cart |
| **Promo Banner** | Full-width gradient banner with a live countdown timer |
| **Features Section** | 4 feature cards — Free Delivery, Easy Returns, Secure Payment, 24/7 Support |
| **Testimonials** | 3 customer review cards (one featured) |
| **Newsletter** | Validated signup form (name required ≥2 chars, valid email regex), loading state, success message |
| **Footer** | Multi-column with social icons, quick links, support, company, contact, payment icons |
| **Back to Top** | Floating button appears after scrolling 320px |
| **Toast Notifications** | Animated bottom-center toasts for cart and newsletter actions |
| **Scroll Reveal** | IntersectionObserver-based staggered fade-in for all sections |

---

## ▶️ How to Run

### Option A — Direct open (no server required)

1. Download or clone this repository.
2. Navigate into the `task2/` folder.
3. **Double-click `index.html`** — it opens directly in your browser.

> All CDN assets (Bootstrap 5, Bootstrap Icons, Google Fonts) require an internet connection.

### Option B — VS Code Live Server (recommended)

1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.
2. Right-click `index.html` → **Open with Live Server**.
3. Auto-reloads on every save.

### Option C — Python HTTP server

```bash
cd task2
python -m http.server 5500
# Visit: http://localhost:5500
```

### Option D — Node.js serve

```bash
npx -y serve task2
```

---

## 🛠️ Customisation Checklist

- [ ] Replace `placehold.co` product images with real product photos
- [ ] Update product names, prices, and descriptions in `index.html`
- [ ] Edit the `roles[]` / hero copy in `index.html` and `script.js`
- [ ] Update contact/social links in the footer
- [ ] Replace the newsletter form's `setTimeout` mock with a real API call (e.g., Mailchimp, ConvertKit)
- [ ] Replace checkout stub (`showToast`) with a real payment/checkout flow
- [ ] Adjust the countdown end time in `script.js` → `initCountdown()`

---

## 🧩 Dependencies (CDN — no install)

| Library | Version | Purpose |
|---|---|---|
| [Bootstrap](https://getbootstrap.com/) | 5.3.3 | Grid, collapse, utilities |
| [Bootstrap Icons](https://icons.getbootstrap.com/) | 1.11.3 | Icon font |
| [Google Fonts](https://fonts.google.com/) | — | Syne (headings) + DM Sans (body) |

---

## 🗺️ Browser Support

Chrome 90+, Firefox 88+, Edge 90+, Safari 14+

---

## 📄 License

Free to use for personal and commercial projects.
