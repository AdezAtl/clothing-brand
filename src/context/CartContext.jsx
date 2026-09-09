import React, { createContext, useContext, useState, useEffect } from 'react';
import { DELIVERY_OPTIONS } from '../utils/formatters';

const CartContext = createContext(null);
const STORAGE_KEY = 'lolashub_cart_v2';

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSizingModalOpen, setIsSizingModalOpen] = useState(false);
  const [activeQuickViewProduct, setActiveQuickViewProduct] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(DELIVERY_OPTIONS[0]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const addToCart = (product, size) => {
    const chosenSize = size || product.sizes[0];
    const cartItemId = `${product.id}-${chosenSize}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          id: product.id,
          name: product.name,
          price: product.price,
          size: chosenSize,
          fabric: product.fabric,
          pattern: product.pattern,
          accentColor: product.accentColor,
          quantity: 1,
          stock: product.stock
        }
      ];
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryPrice = cart.length > 0 ? selectedDelivery.price : 0;
  const total = subtotal + deliveryPrice;

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems,
        subtotal,
        total,
        selectedDelivery,
        setSelectedDelivery,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isSizingModalOpen,
        setIsSizingModalOpen,
        activeQuickViewProduct,
        setActiveQuickViewProduct,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
