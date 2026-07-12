import { Link } from "react-router-dom";
import {
  FiX,
  FiHome,
  FiShoppingBag,
  FiClock,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";

function Sidebar({ isOpen, onClose, isLoggedIn, handleLogout }) {
  return (
    <>
      {/* Overlay */}

      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-[9998] transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Sidebar */}

      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-[9999]
        shadow-2xl transition-transform duration-300 ease-in-out
        ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Header */}

        <div className="bg-[#8f0000] text-white p-5 flex justify-between items-center">

          <h2 className="text-xl font-bold tracking-wide">
            RIYA TEX
          </h2>

          <button onClick={onClose}>
            <FiX size={26} />
          </button>

        </div>

        {/* Menu */}

        <div className="py-4">

          <Link
            to="/"
            onClick={onClose}
            className="flex justify-between items-center px-6 py-4 hover:bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <FiHome />
              Home
            </div>
            <FiChevronRight />
          </Link>

          <div className="px-6 mt-4 mb-2 text-xs font-semibold text-gray-400 uppercase">
            Collections
          </div>

          <Link
            to="/shopping"
            onClick={onClose}
            className="block px-6 py-3 hover:bg-gray-100"
          >
            All Collection
          </Link>

          <Link
            to="/shopping?fabric=Silk"
            onClick={onClose}
            className="block px-6 py-3 hover:bg-gray-100"
          >
            Silk Sarees
          </Link>

          <Link
            to="/shopping?fabric=Cotton"
            onClick={onClose}
            className="block px-6 py-3 hover:bg-gray-100"
          >
            Cotton Sarees
          </Link>

          <Link
            to="/shopping?fabric=Designed"
            onClick={onClose}
            className="block px-6 py-3 hover:bg-gray-100"
          >
            Designer Sarees
          </Link>

          <Link
            to="/shopping?fabric=Kids"
            onClick={onClose}
            className="block px-6 py-3 hover:bg-gray-100"
          >
            Kids
          </Link>

          <Link
            to="/shopping?fabric=Dhotis"
            onClick={onClose}
            className="block px-6 py-3 hover:bg-gray-100"
          >
            Dhotis
          </Link>

          <hr className="my-4" />

          {isLoggedIn && (
            <>
              <Link
                to="/dashboard"
                onClick={onClose}
                className="flex items-center gap-3 px-6 py-4 hover:bg-gray-100"
              >
                <FiClock />
                Order History
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-6 py-4 text-red-600 hover:bg-red-50"
              >
                <FiLogOut />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Sidebar;