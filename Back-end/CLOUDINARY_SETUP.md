# Cloudinary product-image setup

The G3 admin product form now supports choosing an image directly from the computer.

## 1. Create/configure Cloudinary

In your Cloudinary account, get the Cloud Name, API Key and API Secret from the account settings.

## 2. Add these to Back-end/.env

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_PRODUCT_FOLDER=g3-store/products

Do NOT put CLOUDINARY_API_SECRET in the React/Vite `.env` file. It belongs only on the backend.

## 3. Restart the backend

The backend exposes an admin-only signature endpoint. The browser uses that signature to upload the selected image directly to Cloudinary. The API secret never reaches the browser.

## 4. Use the existing Admin Catalogue

Open `/admin/login`, sign in as an admin, choose **Add product**, and use **Choose image** in the existing product form.

The existing G3 admin styling/layout is intentionally preserved.
