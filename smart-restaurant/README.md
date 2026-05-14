<h1 align="center">🍽️ Smart Restaurant Ordering System</h1>

<p align="center">
  A full-stack, contactless restaurant ordering system — independently re-architected from a legacy PHP/MySQL group project into a modern, production-grade <strong>Laravel 11 MVC</strong> application.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel 11">
  <img src="https://img.shields.io/badge/PHP-8.3-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP 8.3">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite">
  <img src="https://img.shields.io/badge/Pest-v4-F9322C?style=for-the-badge" alt="Pest v4">
  <img src="https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
</p>

---

## 📖 About This Project

This project is a **solo ground-up rebuild** of a QR-code-based restaurant ordering system I originally developed as part of a 5-person university group project using procedural PHP and raw MySQL.

The original system worked — but it was built without a framework, had no separation of concerns, and was difficult to extend. I rebuilt the entire application independently to demonstrate my capabilities as a modern PHP/Laravel developer, applying industry-standard architecture, authentication, file handling, and automated testing.

**What changed:**

| Original (University Group Project) | This Rebuild (Solo) |
|---|---|
| Procedural PHP (no framework) | Laravel 11 MVC (PHP 8.3) |
| Raw MySQL queries | Eloquent ORM + Migrations |
| Vanilla CSS | Tailwind CSS v3 + Alpine.js |
| Manual session handling | Laravel Breeze (Auth scaffolding) |
| No testing | Pest v4 automated test suite |
| 5-person team | 1 developer |

---

## ✨ Features

### 👤 Customer Flow (Public — No Login Required)
- **QR Code Access** — Customers scan a table-specific QR code to open a categorized, image-rich digital menu (`/table/{table_number}`)
- **Session-Based Cart** — Each table has its own isolated cart stored in the server session (`cart_{table_number}`), with add/remove and live quantity tracking
- **Special Instructions** — Customers can attach optional order notes (up to 500 characters) at checkout
- **One-Tap Checkout** — Cart is validated, an `Order` record is created with all `OrderItem` line-items, total price is computed server-side, and the session is cleared atomically

### 🔐 Admin Panel (Auth-Protected)
- **Laravel Breeze Authentication** — Full registration, login, logout, email verification, password reset, and profile management out of the box
- **Menu Item CRUD** — Create, edit, and delete menu items with descriptions, prices, categories, availability toggles, and image uploads
- **Secure Image Uploads** — Menu images are validated for MIME type (`jpeg`, `png`, `jpg`, `gif`, `webp`) and file size (max 5MB), then stored via Laravel's Storage facade in the `public/menu_images` disk
- **Category Management** — Full CRUD for food categories with unique-name enforcement at the database and validation layer

### 🍳 Kitchen Dashboard (Auth-Protected)
- **Live Pending Orders** — Displays all `pending` orders, sorted oldest-first, to help kitchen staff prioritize
- **Eager-Loaded Queries** — Uses Eloquent's `with('orderItems.menuItem')` to avoid N+1 performance issues on the order queue
- **Order Completion** — One-click action updates an order's status to `completed` and removes it from the queue

---

## 🏗️ Architecture & Tech Stack

```
smart-restaurant/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       ├── OrderController.php       # Cart, Checkout, Kitchen Dashboard
│   │       ├── MenuItemController.php    # Full CRUD + Image Uploads
│   │       ├── CategoryController.php    # Full CRUD
│   │       └── ProfileController.php     # User Profile Management
│   └── Models/
│       ├── Order.php         # hasMany OrderItems
│       ├── OrderItem.php     # belongsTo Order & MenuItem
│       ├── MenuItem.php      # belongsTo Category
│       └── Category.php      # hasMany MenuItems
├── database/
│   └── migrations/           # 8 versioned schema migrations
├── resources/views/
│   ├── customer/             # Public-facing menu & cart UI
│   ├── kitchen/              # Kitchen order dashboard
│   ├── menu/                 # Admin menu item management
│   ├── categories/           # Admin category management
│   └── layouts/              # Shared Blade layout components
├── routes/
│   ├── web.php               # All app routes (public + auth-guarded)
│   └── auth.php              # Breeze auth routes
└── tests/
    ├── Feature/
    │   ├── Auth/             # 6 Pest feature tests (auth lifecycle)
    │   └── ProfileTest.php
    └── Pest.php              # Global Pest config (RefreshDatabase)
```

**Key Technical Decisions:**
- **SQLite** for zero-configuration local development (drop-in swap for MySQL/PostgreSQL in production via `.env`)
- **Vite** for fast HMR asset bundling in development
- **Alpine.js** for lightweight reactive UI interactions without a full JS framework
- **Route::resource()** for clean, conventional RESTful routing across admin controllers
- Middleware groups (`auth`, `verified`) to enforce strict role-based access boundaries

---

## 🚀 Getting Started

### Prerequisites
- PHP 8.3+
- Composer
- Node.js 18+

### Quick Setup

```bash
# 1. Clone the repository
git clone https://github.com/skyp3crack/Rebuild-Restaurant-Smart-Ordering-System.git
cd Rebuild-Restaurant-Smart-Ordering-System/smart-restaurant

# 2. Run the one-command setup script
composer run setup
```

The `setup` script will automatically:
1. Install all PHP dependencies (`composer install`)
2. Copy `.env.example` → `.env`
3. Generate the application encryption key
4. Run all database migrations
5. Install Node dependencies and build frontend assets

### Running Locally

```bash
composer run dev
```

This starts all development processes concurrently:
- **`php artisan serve`** → App server at `http://127.0.0.1:8000`
- **`npm run dev`** → Vite HMR for Tailwind CSS hot-reloading
- **`php artisan pail`** → Real-time log tail in the terminal
- **`php artisan queue:listen`** → Background job worker

### Accessing the Application

| URL | Description |
|-----|-------------|
| `http://127.0.0.1:8000` | Landing page |
| `http://127.0.0.1:8000/table/1` | Customer menu for Table 1 |
| `http://127.0.0.1:8000/register` | Register an admin account |
| `http://127.0.0.1:8000/dashboard` | Admin dashboard (auth required) |
| `http://127.0.0.1:8000/kitchen` | Kitchen order queue (auth required) |
| `http://127.0.0.1:8000/menu` | Menu item management (auth required) |

---

## 🧪 Running Tests

```bash
composer run test
```

The Pest test suite covers the full **authentication lifecycle**:

| Test File | Coverage |
|-----------|----------|
| `AuthenticationTest.php` | Login rendering, valid/invalid credentials, logout |
| `RegistrationTest.php` | New user registration flow |
| `PasswordResetTest.php` | Password reset link request & form |
| `PasswordUpdateTest.php` | In-session password change |
| `PasswordConfirmationTest.php` | Sudo-mode confirmation gate |
| `EmailVerificationTest.php` | Verification prompt, resend, and link handling |
| `ProfileTest.php` | Profile display, update, and account deletion |

All feature tests use the `RefreshDatabase` trait to guarantee a clean database state on every run.

---

## 📋 Database Schema

```
users               # Admin accounts (Laravel Breeze)
categories          # Menu categories (e.g., "Main Course", "Drinks")
menu_items          # Items with price, image_path, is_available flag → FK: categories
orders              # Customer orders with table_number, status, total_price, notes
order_items         # Line-items → FK: orders, menu_items
```

---

## 🔗 Related

- **Original Group Project** *(legacy procedural PHP/MySQL)* — This rebuild supersedes that version.
- Built following [Laravel 11 Official Documentation](https://laravel.com/docs/11.x)

---

## 📄 License

This project is open-sourced under the [MIT License](https://opensource.org/licenses/MIT).
