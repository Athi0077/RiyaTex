import { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { FiX, FiHeart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from "react-icons/fi";

function WishlistDrawer() {
  const { wishlist, isDrawerOpen, setIsDrawerOpen, removeFromWishlist, clearWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckout = (item) => {
    setIsDrawerOpen(false);

    // Add item to the Shopping Bag
    const colorIdx = item.selectedColorIndex || 0;
    addToCart(item, colorIdx);
  };

  return (
    <>
      {/* Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button
            onClick={() => setIsCartOpen(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#8f0000] text-white hover:bg-[#730000] transition-all duration-300 shadow-md">
            <FiArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h2 className="text-xl font-bold text-brand flex items-center gap-2">
            <FiHeart className="fill-current" /> Wishlist
          </h2>
          <button
            onClick={clearWishlist}
            className="text-xs font-semibold border border-red-200 text-red-500 px-3 py-1 rounded-full hover:bg-red-50 transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {wishlist.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              Your wishlist is empty.
            </div>
          ) : (
            wishlist.map((item) => {
              // Determine display image based on saved index
              const colorIdx = item.selectedColorIndex || 0;
              let displayImg = 'https://placehold.co/400x300?text=No+Image';
              if (item.colorVariants && item.colorVariants[colorIdx] && item.colorVariants[colorIdx].images?.length > 0) {
                displayImg = item.colorVariants[colorIdx].images[0];
              } else if (item.image) {
                displayImg = item.image;
              }

              // Determine saved color hex
              let hexColor = '#000';
              if (item.colorVariants && item.colorVariants[colorIdx]) {
                hexColor = item.colorVariants[colorIdx].hex;
              }

              return (
                <div key={item._id} className="flex gap-4 p-3 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white group">
                  <div className="w-24 h-32 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <img src={displayImg} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
                  </div>

                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
                        <p className="text-xs text-gray-500">{item.fabric || item.category}</p>
                      </div>
                      <button
                        onClick={() => removeFromWishlist(item._id)}
                        className="text-red-400 hover:text-red-600 transition-colors p-1"
                        title="Remove from wishlist"
                      >
                        <FiHeart size={16} className="fill-current" />
                      </button>
                    </div>

                    <div className="mt-2 text-brand font-bold text-sm">
                      ₹{item.sellingPrice || item.price}
                    </div>

                    <div className="flex items-center gap-1 mt-2">
                      <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: hexColor }}></div>
                    </div>

                    <button
                      onClick={() => handleCheckout(item)}
                      className="mt-auto w-full bg-brand text-white text-xs font-bold py-1.5 rounded-full hover:bg-brand-light transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-center text-sm text-gray-600 font-medium">
          {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved
        </div>
      </div>
    </>
  );
}

export default WishlistDrawer;
