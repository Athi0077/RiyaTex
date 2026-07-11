import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiArrowUp, FiHome, FiShoppingBag, FiHeart, FiShoppingCart, FiUser } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

function FloatingFeatures() {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const location = useLocation();
  const { cart, setIsCartOpen } = useContext(CartContext);
  const { wishlist, setIsDrawerOpen } = useContext(WishlistContext);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const openWhatsApp = () => {
    const ADMIN_WHATSAPP = '918056510875';
    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=Hello Riya Tex, I have a query.`, '_blank');
  };

  if (isAdminRoute) return null; // Don't show these on admin pages

  return (
    <>
      {/* Floating Action Buttons (Desktop & Mobile) */}
      <div className="fixed bottom-24 sm:bottom-6 right-6 flex flex-col gap-4 z-40">
        {/* WhatsApp Button */}
        <button
          onClick={openWhatsApp}
          className="bg-[#25D366] hover:bg-[#1ebd5b] text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center animate-bounce"
          title="Chat on WhatsApp"
        >
          <FaWhatsapp size={28} />
        </button>

        {/* Back to Top Button */}
        {showTopBtn && (
          <button
            onClick={scrollToTop}
            className="bg-gray-800 hover:bg-black text-white p-3 rounded-full shadow-lg transition-opacity flex items-center justify-center opacity-80 hover:opacity-100"
            title="Back to Top"
          >
            <FiArrowUp size={24} />
          </button>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 flex justify-between items-center px-6 py-3 pb-safe">
        <Link to="/" className={`flex flex-col items-center gap-1 ${location.pathname === '/' ? 'text-brand' : 'text-gray-500'}`}>
          <FiHome size={22} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link to="/shopping" className={`flex flex-col items-center gap-1 ${location.pathname === '/shopping' ? 'text-brand' : 'text-gray-500'}`}>
          <FiShoppingBag size={22} />
          <span className="text-[10px] font-medium">Shop</span>
        </Link>
        <button onClick={() => setIsDrawerOpen(true)} className="flex flex-col items-center gap-1 text-gray-500 relative">
          <FiHeart size={22} />
          <span className="text-[10px] font-medium">Saved</span>
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              {wishlistCount}
            </span>
          )}
        </button>
        <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center gap-1 text-gray-500 relative">
          <FiShoppingCart size={22} />
          <span className="text-[10px] font-medium">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-brand text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </button>
        <Link to="/dashboard" className={`flex flex-col items-center gap-1 ${location.pathname === '/dashboard' || location.pathname === '/profile' ? 'text-brand' : 'text-gray-500'}`}>
          <FiUser size={22} />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </div>
    </>
  );
}

export default FloatingFeatures;
