import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

function isWelcomeGiftItem(item) {
  return (
    item?.isWelcomeGift === true ||
    item?.id === "welcome-g3-tshirt" ||
    item?.baseProductId === "welcome-g3-tshirt"
  );
}

function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("g3-box");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("g3-box", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((currentItems) => {
      // Welcome gift: only one, always quantity 1
      if (isWelcomeGiftItem(product)) {
        const exists = currentItems.some((item) => isWelcomeGiftItem(item));
        if (exists) return currentItems;
        return [
          ...currentItems,
          {
            ...product,
            id: "welcome-g3-tshirt",
            baseProductId: "welcome-g3-tshirt",
            isWelcomeGift: true,
            quantity: 1,
            price: 0,
          },
        ];
      }

      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  };

  const increaseQuantity = (productId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== productId) return item;
        if (isWelcomeGiftItem(item)) return { ...item, quantity: 1 };
        return { ...item, quantity: item.quantity + 1 };
      })
    );
  };

  const decreaseQuantity = (productId) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) => {
          if (item.id !== productId) return item;
          if (isWelcomeGiftItem(item)) return { ...item, quantity: 1 };
          return { ...item, quantity: item.quantity - 1 };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + Number(item.price || 0) * item.quantity,
        0
      ),
    [cartItems]
  );

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}

export default CartProvider;