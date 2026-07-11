import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiHeart, FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';
import { useContext, useState, useEffect } from 'react';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';

function Navbar() {
  const { setIsDrawerOpen, wishlist } = useContext(WishlistContext);
  const { setIsCartOpen, cart } = useContext(CartContext);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    // Re-check login status on storage changes (cross-tab support)
    const handleStorage = () => setIsLoggedIn(!!localStorage.getItem('token'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userMobile');
    setIsLoggedIn(false);
    navigate('/');
  };
  
  // Calculate total quantity for the badge
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Left: Menu */}
          <div className="flex items-center space-x-2 text-gray-700 cursor-pointer hover:text-brand transition-colors">
            <FiMenu className="h-6 w-6" />
            <span className="hidden sm:inline-block font-medium tracking-wide">MENU</span>
          </div>

          {/* Center: Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-widest text-brand hover:text-brand-light transition-colors">
              RIYA TEX
            </Link>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center space-x-6 text-gray-700">
            <button 
              className="hover:text-brand transition-colors relative"
              onClick={() => setIsDrawerOpen(true)}
            >
              <FiHeart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-brand text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button 
              className="hover:text-brand transition-colors relative"
              onClick={() => setIsCartOpen(true)}
            >
              <FiShoppingCart className="h-5 w-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-brand text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </button>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="flex items-center gap-1 hover:text-red-500 transition-colors text-sm font-medium">
                <FiLogOut className="h-5 w-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <Link to="/login" className="hover:text-brand transition-colors">
                <FiUser className="h-5 w-5" />
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
