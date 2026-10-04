# G3 Lounge Backend

The backend API for G3 Lounge / G3 Store.

## Stack

- Node.js + Express
- MySQL + Sequelize
- JWT authentication
- bcrypt password hashing
- Cloudinary signed product-image uploads
- Paystack-ready payments

## Folder structure

```text
Back-end/
├── config/             # Database configuration
├── controllers/        # Business logic for API endpoints
├── middlewares/        # Authentication and authorization
├── models/             # Sequelize database models
├── routes/             # HTTP API routes
├── scripts/            # One-off administration scripts
├── seeders/            # Catalog seed data
├── utils/              # Tokens, membership, product access, migrations
├── .env.example
└── server.js
```

## 1. Install

Use Node.js 20+ (Node 24 is also supported by the project configuration).

```bash
npm install
```

## 2. Configure environment

Copy `.env.example` to `.env` and fill in your own values.

Never commit `.env` to GitHub.

Required for normal operation:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=g3_lounge
DB_USER=root
DB_PASSWORD=
JWT_SECRET=use-a-long-random-secret
PORT=5000
NODE_ENV=development
FRONTEND_URLS=http://localhost:5173
DEFAULT_SHIPPING_FEE=2500
```

Cloudinary is required for the admin image-upload feature:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_PRODUCT_FOLDER=g3-store/products
```

Paystack is optional until checkout is connected to the payment API:

```env
PAYSTACK_SECRET_KEY=
PAYSTACK_CALLBACK_URL=http://localhost:5173/payment/callback
```

## 3. Start the API

Development:

```bash
npm run dev
```

Production-style:

```bash
npm start
```

The API defaults to:

```text
http://localhost:5000
```

Health check:

```text
GET /health
```

## 4. Create the first administrator

Put the account you want to make an administrator into `.env`:

```env
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-admin-password
ADMIN_FIRST_NAME=YourFirstName
ADMIN_LAST_NAME=YourLastName
ADMIN_PHONE=08000000000
```

Then run:

```bash
npm run create-admin
```

If the email already belongs to a G3 customer, the script promotes that account to `admin` and activates it. If it does not exist, the script creates the administrator account.

The admin login page uses the normal `/api/v1/auth/login` endpoint. The important difference is that the returned user has:

```json
"role": "admin"
```

## 5. API groups

### Authentication

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
```

### Public catalogue

```text
GET /api/v1/products
GET /api/v1/products/:id
GET /api/v1/products/featured
GET /api/v1/products/new-arrivals
GET /api/v1/products/categories
```

Product access is enforced by membership tier:

```text
Guest   -> general
Member  -> general + member
Premier -> general + member + premier
```

### Customer orders

Authenticated routes:

```text
POST /api/v1/orders
GET  /api/v1/orders
GET  /api/v1/orders/membership
GET  /api/v1/orders/:id
POST /api/v1/orders/:id/cancel
```

The server calculates prices from the database. The browser is not trusted to decide product prices or stock.

### Referrals

```text
GET /api/v1/referrals/validate/:code
GET /api/v1/referrals/mine
```

When a new account registers with a valid referral code, the backend records the referral.

### Payments

Paystack-ready authenticated routes:

```text
POST /api/v1/payments/initialize
GET  /api/v1/payments/verify/:reference
```

Webhook:

```text
POST /api/v1/payments/webhook
```

Payments remain disabled until `PAYSTACK_SECRET_KEY` is configured.

### Administrator

All `/api/v1/admin/*` routes require both a valid JWT and `role = admin`.

```text
GET    /api/v1/admin/dashboard
GET    /api/v1/admin/products
POST   /api/v1/admin/products
PUT    /api/v1/admin/products/:id
DELETE /api/v1/admin/products/:id
GET    /api/v1/admin/categories
POST   /api/v1/admin/categories
PUT    /api/v1/admin/categories/:id
DELETE /api/v1/admin/categories/:id
GET    /api/v1/admin/orders
PATCH  /api/v1/admin/orders/:id
GET    /api/v1/admin/users
PATCH  /api/v1/admin/users/:id
GET    /api/v1/admin/cloudinary/signature
```

## Database safety

The server uses `sequelize.sync()` without `alter: true` or `force: true`.

Startup also performs small compatibility migrations for the existing G3 database. In particular, an old development version of `OrderItem.js` had accidentally defined the Order schema for the `order_items` table. The migration detects that shape and renames the old table instead of deleting it, then creates the correct order-items table.

## Important security rules

- Do not put database passwords, JWT secrets, Cloudinary API secrets, or Paystack secret keys in frontend code.
- The admin frontend receives a JWT, but authorization is enforced again by the backend.
- Product prices and stock are read from MySQL when an order is created.
- Product images use a server-generated Cloudinary signature so the Cloudinary API secret never reaches the browser.
- Passwords are stored as bcrypt hashes, never plaintext.

## G3 catalogue and payments update

The storefront catalogue is now database-only. Do not seed the old frontend catalogue. Add products through the protected Admin Console.

To intentionally wipe the current product catalogue before starting fresh, make sure there are no order items that reference products, then run:

```bash
CONFIRM_RESET_CATALOG=YES npm run catalog:reset
```

On Windows PowerShell:

```powershell
$env:CONFIRM_RESET_CATALOG="YES"; npm run catalog:reset
```

Bank transfer checkout reads these values from the backend `.env`:

```env
BANK_NAME=Your Bank
BANK_ACCOUNT_NAME=G3 Store
BANK_ACCOUNT_NUMBER=0000000000
WHATSAPP_NUMBER=2348000000000
BANK_TRANSFER_INSTRUCTIONS=Transfer the exact order total, then send your receipt to G3 WhatsApp for verification.
```

Paystack remains controlled by `PAYSTACK_SECRET_KEY` and the existing Paystack callback/webhook configuration.
