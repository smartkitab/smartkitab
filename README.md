# SMARTKITAB - Second-Hand Book Marketplace

SMARTKITAB is a full-stack second-hand book marketplace designed for students and avid readers across Nepal to buy verified second-hand books at up to 70% off, list their used books for sale or donation, and discover literature and curriculum texts.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string.

---

## 🚀 Quick Start Guide

You will need **two terminal windows**: one for the Backend API and one for the Frontend client.

### Step 1: Start Backend (Terminal 1)

```bash
cd backend

# Install dependencies (if not already installed)
npm install

# (Optional) Seed the database with sample books and test accounts
npm run seed

# Start development server
npm run dev
```
> The backend server will run on `http://localhost:5000`.

### Step 2: Start Frontend (Terminal 2)

```bash
cd frontend

# Install dependencies (if not already installed)
npm install

# Start Vite dev server
npm run dev
```
> Open your browser and navigate to `http://localhost:5173`.

---

## 🔑 Pre-Seeded Test Accounts

When you run `npm run seed` in the backend, the following accounts are available:

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@smartkitab.com` | `password123` | Full access to `/admin` dashboard (approve/reject listings, stats, order management) |
| **Seller** | `seller@smartkitab.com` | `password123` | Storefront & listing books on `/sell` |
| **Buyer** | `buyer@smartkitab.com` | `password123` | Storefront browsing, cart, book discovery |

> **Tip**: On the `/login` page, you can click the **Quick Fill** buttons to log in with any test account in one click.

---

## 📁 Project Architecture

```text
sasto kitab/
├── backend/
│   ├── controllers/      # Route controllers (auth, book, admin)
│   ├── middleware/       # JWT auth & admin guard middleware
│   ├── models/           # Mongoose models (User, Book, Order, BookRequest)
│   ├── routes/           # Express API endpoints
│   ├── seed.js           # Database seeder script
│   └── server.js         # Main Express entrypoint
│
└── frontend/
    ├── src/
    │   ├── components/   # UI components (Navbar, Hero, BookCard, CartDrawer, etc.)
    │   ├── context/      # Global state (AuthContext, CartContext)
    │   ├── pages/        # Pages (HomePage, Catalog, ProductDetail, SellBook, AdminDashboard, AuthPage)
    │   ├── App.jsx       # React Router DOM configuration
    │   └── main.jsx      # React DOM entrypoint
```

---

## 🌐 Key Routes

- `/`: Storefront landing page with Hero, Category grid, Featured Books, Best Sellers, and BookCycle banner.
- `/catalog`: Searchable, filterable catalog with category checkboxes, condition badges, and price slider.
- `/book/:id`: Product detail view with photo gallery, book condition summary, seller profile, and direct WhatsApp chat button.
- `/sell`: 3-step listing wizard to submit books for sale or donation.
- `/login` & `/register`: User authentication with 1-click test helpers.
- `/admin`: Protected admin dashboard for listing approvals, platform metrics, and order management.
