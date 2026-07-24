import { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, selectedColorIndex) => {
    setCart(prev => {
      // Check if same product AND same color variant already exists
      const existingItem = prev.find(
        item => item._id === product._id && item.selectedColorIndex === selectedColorIndex
      );

      if (existingItem) {
        return prev.map(item => 
          (item._id === product._id && item.selectedColorIndex === selectedColorIndex)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, selectedColorIndex, quantity: 1 }];
      }
    });
    toast.success(`${product.name} added to cart!`, { duration: 2000 });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId, selectedColorIndex, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prev => prev.map(item => 
      (item._id === productId && item.selectedColorIndex === selectedColorIndex)
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeFromCart = (productId, selectedColorIndex) => {
    setCart(prev => prev.filter(
      item => !(item._id === productId && item.selectedColorIndex === selectedColorIndex)
    ));
    toast.success('Item removed from cart', { icon: '🗑️', duration: 2000 });
  };

  const clearCart = () => {
    setCart([]);
    toast.success('Cart cleared', { icon: '🧹', duration: 2000 });
  };

  return (
    <CartContext.Provider value={{
      cart,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}
