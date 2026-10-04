import { getAdminToken } from "./adminApi";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export const uploadProductImage = async (file) => {
  if (!file) throw new Error("Please choose an image.");
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Product images must be 8 MB or smaller.");

  const token = getAdminToken();
  const signatureResponse = await fetch(`${API_BASE}/admin/cloudinary/signature`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const signatureData = await signatureResponse.json().catch(() => ({}));
  if (!signatureResponse.ok) {
    throw new Error(signatureData.message || "Could not prepare image upload.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signatureData.apiKey);
  formData.append("timestamp", String(signatureData.timestamp));
  formData.append("folder", signatureData.folder);
  formData.append("signature", signatureData.signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
    { method: "POST", body: formData }
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error?.message || "Image upload failed.");

  return { url: data.secure_url, publicId: data.public_id };
};
