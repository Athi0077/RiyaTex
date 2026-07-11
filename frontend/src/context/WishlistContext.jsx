import { createContext, useState, useEffect } from 'react';

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product, selectedColorIndex) => {
    // Add item with the currently selected color
    setWishlist(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) return prev; // Already in wishlist
      return [...prev, { ...product, selectedColorIndex }];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => item._id !== productId));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const toggleWishlist = (product, selectedColorIndex) => {
    const existing = wishlist.find(item => item._id === product._id);
    if (existing) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product, selectedColorIndex);
    }
  };

  const isWishlisted = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      isDrawerOpen,
      setIsDrawerOpen,
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
      toggleWishlist,
      isWishlisted
    }}>
      {children}
    </WishlistContext.Provider>
  );
}
