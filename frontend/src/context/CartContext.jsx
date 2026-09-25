import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'smartkitab_cart';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.warn('Failed to parse cart from localStorage:', err);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync to localStorage whenever cartItems changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (err) {
      console.warn('Failed to save cart to localStorage:', err);
    }
  }, [cartItems]);

  // Helper to extract unique ID
  const getItemId = (item) => item?._id || item?.id;

  // Add item to cart
  const addToCart = (book, quantity = 1) => {
    if (!book) return;
    const bookId = getItemId(book);
    if (!bookId) return;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => getItemId(item) === bookId);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const currentQty = updated[existingIndex].quantity || 1;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: currentQty + quantity,
        };
        return updated;
      } else {
        const newItem = {
          ...book,
          id: bookId,
          quantity: quantity,
          price: book.sellingPrice ?? book.price ?? 0,
        };
        return [...prevItems, newItem];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (bookId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => getItemId(item) !== bookId)
    );
  };

  // Update item quantity directly
  const updateQuantity = (bookId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (getItemId(item) === bookId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Clear all items from cart
  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn('Failed to clear cart in localStorage:', err);
    }
  };

  // Compute total price
  const cartTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = Number(item.sellingPrice ?? item.price ?? 0);
      const qty = Number(item.quantity ?? 1);
      return acc + price * qty;
    }, 0);
  }, [cartItems]);

  // Compute total count of items
  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.quantity ?? 1), 0);
  }, [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const value = {
    cartItems,
    cartTotal,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    openCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;

