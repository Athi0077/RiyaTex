import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiMenu,
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiLogOut,
} from "react-icons/fi";
import { useContext, useState, useEffect } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import Sidebar from "./Sidebar";

function Navbar() {
  const { setIsDrawerOpen, wishlist } = useContext(WishlistContext);
  const { setIsCartOpen, cart } = useContext(CartContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  // Update login status whenever route changes
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [location]);

  // Cross-tab login/logout support
  useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userMobile");

    setIsLoggedIn(false);
    setSidebarOpen(false);

    navigate("/");
  };

  const totalCartItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Left Menu */}

            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 text-gray-700 hover:text-[#8f0000] transition"
            >
              <FiMenu className="h-6 w-6" />

              <span className="hidden sm:block font-medium">
                MENU
              </span>
            </button>

            {/* Logo */}

            <Link
              to="/"
              className="text-xl sm:text-2xl font-bold tracking-widest text-[#8f0000]"
            >
              RIYA TEX
            </Link>

            {/* Right Icons */}

            <div className="flex items-center gap-5 text-gray-700">

              {/* Wishlist */}

              <button
                onClick={() => setIsDrawerOpen(true)}
                className="relative hover:text-[#8f0000] transition"
              >
                <FiHeart className="h-5 w-5" />

                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#8f0000] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart */}

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative hover:text-[#8f0000] transition"
              >
                <FiShoppingCart className="h-5 w-5" />

                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#8f0000] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </button>

              {/* Login / Logout */}

              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 hover:text-red-500 transition"
                >
                  <FiLogOut className="h-5 w-5" />

                  <span className="hidden sm:block text-sm">
                    Logout
                  </span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="hover:text-[#8f0000] transition"
                >
                  <FiUser className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
      />
    </>
  );
}

export default Navbar;