import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiArrowUp,
  FiHome,
  FiShoppingBag,
  FiHeart,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

function FloatingFeatures() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  const location = useLocation();

  const { cart, setIsCartOpen } = useContext(CartContext);
  const { wishlist, setIsDrawerOpen } = useContext(WishlistContext);

  const [showShopMenu, setShowShopMenu] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const closeMenu = () => {
      setShowShopMenu(false);
    };

    window.addEventListener("click", closeMenu);

    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openWhatsApp = () => {
    const ADMIN_WHATSAPP = "";
    window.open(
      `https://wa.me/${ADMIN_WHATSAPP}?text=Hello R.S Sarees, I have a query.`,
      "_blank"
    );
  };

  if (isAdminRoute) return null;

  const activeItem = (path) =>
    location.pathname === path ||
    (path === "/dashboard" && location.pathname === "/profile");

  const FloatingIcon = ({ active, icon }) => {
    if (!active) return null;

    return (
      <div className="absolute -top-10">
        <div className="w-16 h-16 rounded-full bg-white border-[6px] border-[#f8dede] shadow-xl flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#8f0000] text-white flex items-center justify-center">
            {icon}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Floating Buttons */}

      <div className="fixed bottom-28 sm:bottom-6 right-5 flex flex-col gap-3 z-[99999]">
        <button
          onClick={openWhatsApp}
          className="bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:scale-110 transition"
        >
          <FaWhatsapp size={28} />
        </button>

        {showTopBtn && (
          <button
            onClick={scrollToTop}
            className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-black"
          >
            <FiArrowUp size={24} />
          </button>
        )}
      </div>

      {/* Bottom Navigation */}

      <div className="sm:hidden fixed bottom-4 left-4 right-4 z-[99999]">
        <div className="relative bg-white rounded-full shadow-2xl h-20 flex items-center justify-around">

          {/* HOME */}

          <Link
            to="/"
            className="relative flex-1 flex flex-col items-center justify-center"
          >
            <FloatingIcon
              active={activeItem("/")}
              icon={<FiHome size={22} />}
            />

            {!activeItem("/") && (
              <FiHome size={22} className="text-gray-400" />
            )}

            <span
              className={`text-[11px] mt-1 ${activeItem("/")
                ? "text-[#8f0000] font-semibold"
                : "text-gray-400"
                }`}
            >
              Home
            </span>
          </Link>

          {/* SHOP */}

          <div
            className="relative flex-1 flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Floating Shop Menu */}
            {showShopMenu && (
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-72 bg-white rounded-3xl shadow-2xl border border-gray-200 p-4 animate-fadeIn z-[99999]">

                <div className="grid grid-cols-2 gap-3">

                  <Link
                    to="/shopping?fabric=Silk"
                    onClick={() => setShowShopMenu(false)}
                    className="bg-[#8f0000] text-white rounded-full py-2 text-center text-sm font-semibold hover:opacity-90 transition"
                  >
                    Silk
                  </Link>

                  <Link
                    to="/shopping?fabric=Cotton"
                    onClick={() => setShowShopMenu(false)}
                    className="bg-[#8f0000] text-white rounded-full py-2 text-center text-sm font-semibold hover:opacity-90 transition"
                  >
                    Cotton
                  </Link>

                  <Link
                    to="/shopping?fabric=Designed"
                    onClick={() => setShowShopMenu(false)}
                    className="bg-[#8f0000] text-white rounded-full py-2 text-center text-sm font-semibold hover:opacity-90 transition"
                  >
                    Designed
                  </Link>

                  <Link
                    to="/shopping?fabric=Kids"
                    onClick={() => setShowShopMenu(false)}
                    className="bg-[#8f0000] text-white rounded-full py-2 text-center text-sm font-semibold hover:opacity-90 transition"
                  >
                    Kids
                  </Link>

                  <Link
                    to="/shopping?fabric=Dhotis"
                    onClick={() => setShowShopMenu(false)}
                    className="col-span-2 bg-[#8f0000] text-white rounded-full py-2 text-center text-sm font-semibold hover:opacity-90 transition"
                  >
                    Dhotis
                  </Link>

                </div>

                {/* Arrow */}
                <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-gray-200 rotate-45"></div>
              </div>
            )}

            {/* Shop Button */}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowShopMenu((prev) => !prev);
              }}
              className="relative flex flex-col items-center justify-center"
            >
              <FloatingIcon
                active={showShopMenu || activeItem("/shopping")}
                icon={<FiShoppingBag size={22} />}
              />

              {!showShopMenu && !activeItem("/shopping") && (
                <FiShoppingBag size={22} className="text-gray-400" />
              )}

              <span
                className={`text-[11px] mt-1 ${showShopMenu || activeItem("/shopping")
                  ? "text-[#8f0000] font-semibold"
                  : "text-gray-400"
                  }`}
              >
                Shop
              </span>
            </button>
          </div>
          {/* SAVED */}

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="relative flex-1 flex flex-col items-center justify-center"
          >
            <FiHeart size={22} className="text-gray-400" />

            {wishlistCount > 0 && (
              <span className="absolute top-0 right-6 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}

            <span className="text-[11px] mt-1 text-gray-400">Saved</span>
          </button>

          {/* CART */}

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex-1 flex flex-col items-center justify-center"
          >
            <FiShoppingCart size={22} className="text-gray-400" />

            {cartCount > 0 && (
              <span className="absolute top-0 right-6 bg-[#8f0000] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}

            <span className="text-[11px] mt-1 text-gray-400">Cart</span>
          </button>

          {/* PROFILE */}

          <Link
            to="/dashboard"
            className="relative flex-1 flex flex-col items-center justify-center"
          >
            <FloatingIcon
              active={activeItem("/dashboard")}
              icon={<FiUser size={22} />}
            />

            {!activeItem("/dashboard") && (
              <FiUser size={22} className="text-gray-400" />
            )}

            <span
              className={`text-[11px] mt-1 ${activeItem("/dashboard")
                ? "text-[#8f0000] font-semibold"
                : "text-gray-400"
                }`}
            >
              Profile
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}

export default FloatingFeatures;