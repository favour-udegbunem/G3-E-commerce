import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ProductContext = createContext(null);

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const getUserToken = () =>
  localStorage.getItem("g3-user-token") ||
  localStorage.getItem("g3-token") ||
  "";

const normalizeProduct = (product) => ({
  ...product,

  id: product.id || product.productCode,
  productCode: product.productCode || product.id,

  category:
    product.category?.slug ||
    product.category ||
    "",

  price: Number(product.price || 0),

  tags: Array.isArray(product.tags)
    ? product.tags
    : [],

  featured: Boolean(product.featured),

  newArrival: Boolean(product.newArrival),

  accessLevel: product.accessLevel || "general",

  stock: Number(product.stock || 0),

  type: product.type || "item",

  occasion: product.occasion || "",

  ageRange: product.ageRange || "",

  contents: Array.isArray(product.contents)
    ? product.contents
    : [],
});

async function fetchProducts(path = "/products") {
  const token = getUserToken();

  const response = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    throw new Error(
      data.message || `Product API failed with status ${response.status}`
    );
  }

  const data = await response.json();

  return (data.products || []).map(normalizeProduct);
}

function ProductProvider({ children }) {
  // IMPORTANT:
  // The database is now the only source of products.
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = async () => {
    setLoading(true);
    setError("");

    try {
      const apiProducts = await fetchProducts();

      setProducts(apiProducts);
    } catch (err) {
      console.error("Failed to load products:", err);

      // DO NOT fall back to localProducts.
      // An API failure should not make old/deleted products reappear.
      setProducts([]);
      setError(err.message || "Could not load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();

    const handleFocus = () => {
      refresh();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const value = useMemo(
    () => ({
      products,
      loading,
      error,
      refresh,
    }),
    [products, loading, error]
  );

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error(
      "useProducts must be used inside ProductProvider"
    );
  }

  return context;
}

export default ProductProvider;