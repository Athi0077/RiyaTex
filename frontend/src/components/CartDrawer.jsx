import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { FiX, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';

function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [address, setAddress] = useState('');

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + ((item.sellingPrice || item.price) * item.quantity), 0);

  // Admin WhatsApp number - change this to your number
  const ADMIN_WHATSAPP = '918056510875';

  const handleCheckout = async () => {
    const email = localStorage.getItem('userEmail');
    const mobile = localStorage.getItem('userMobile') || '';

    if (!email) {
      setIsCartOpen(false);
      navigate('/login');
      return;
    }

    try {
      // Save each cart item as a booking with the user's real mobile number
      const bookingPromises = cart.map(item => {
        const payload = {
          customerEmail: email,
          mobile: mobile,
          sareeId: item._id,
          sareeName: item.name,
          qty: item.quantity,
          amount: (item.sellingPrice || item.price) * item.quantity,
          paymentType: 'cod',
          status: 'Pending',
          address: address,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        };
        return api.post('/bookings', payload);
      });

      await Promise.all(bookingPromises);

      // Build WhatsApp message with full order details
      const orderLines = cart.map((item, idx) => {
        const colorIdx = item.selectedColorIndex || 0;
        const colorName = item.colorVariants?.[colorIdx]?.name || 'N/A';
        return `${idx + 1}. *${item.name}*\n   Fabric: ${item.fabric || item.category || 'N/A'}\n   Color: ${colorName}\n   Qty: ${item.quantity} × ₹${item.sellingPrice || item.price} = ₹${item.quantity * (item.sellingPrice || item.price)}`;
      }).join('\n\n');

      const whatsappMessage = encodeURIComponent(
        `🛍️ *New Order from Riya Tex Website*\n\n` +
        `👤 *Customer Details:*\n` +
        `Email: ${email}\n` +
        `Mobile: ${mobile || 'Not provided'}\n` +
        `Address: ${address || 'Not provided'}\n\n` +
        `📦 *Order Items:*\n\n${orderLines}\n\n` +
        `💰 *Total Amount: ₹${totalPrice}*\n` +
        `🚚 Payment: Cash on Delivery\n\n` +
        `Please confirm the order. Thank you! 🙏`
      );

      const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${whatsappMessage}`;

      clearCart();
      setIsCartOpen(false);

      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');
      toast.success('Order placed successfully!', { duration: 3000 });
    } catch (error) {
      console.error(error);
      toast.error('Failed to place order. Ensure backend is connected.');
    }
  };

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] transition-opacity" 
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button 
            onClick={() => setIsCartOpen(false)} 
            className="text-gray-500 hover:text-gray-800 transition-colors"
          >
            ←
          </button>
          <h2 className="text-xl font-bold text-brand flex items-center gap-2">
            <FiShoppingCart className="fill-current" /> Shopping Bag
          </h2>
          <button 
            onClick={clearCart}
            className="text-xs font-semibold border border-red-200 text-red-500 px-3 py-1 rounded-full hover:bg-red-50 transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              Your shopping bag is empty.
            </div>
          ) : (
            cart.map((item) => {
              const colorIdx = item.selectedColorIndex || 0;
              let displayImg = 'https://placehold.co/400x300?text=No+Image';
              if (item.colorVariants && item.colorVariants[colorIdx] && item.colorVariants[colorIdx].images?.length > 0) {
                displayImg = item.colorVariants[colorIdx].images[0];
              } else if (item.image) {
                displayImg = item.image;
              }

              let hexColor = '#000';
              if (item.colorVariants && item.colorVariants[colorIdx]) {
                hexColor = item.colorVariants[colorIdx].hex;
              }

              return (
                <div key={`${item._id}-${colorIdx}`} className="flex gap-4 p-3 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
                  <div className="w-24 h-32 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <img src={displayImg} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span>{item.fabric || item.category}</span>
                        <div className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: hexColor }}></div>
                      </div>
                      <div className="mt-2 text-brand font-bold text-sm">
                        ₹{item.sellingPrice || item.price}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-200 rounded-full bg-gray-50 px-2 py-1">
                        <button 
                          onClick={() => updateQuantity(item._id, colorIdx, item.quantity - 1)}
                          className="px-2 text-gray-500 hover:text-black transition-colors"
                        >-</button>
                        <span className="px-3 font-semibold text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, colorIdx, item.quantity + 1)}
                          className="px-2 text-gray-500 hover:text-black transition-colors"
                        >+</button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item._id, colorIdx)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        title="Remove from cart"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-white">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-gray-800">Total ({totalItems} items)</span>
              <span className="font-bold text-brand text-lg">₹{totalPrice}</span>
            </div>
            {/* Address Input */}
            <textarea
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="📍 Delivery address (street, city, pincode)..."
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-brand resize-none mb-3"
            />
            <button
              onClick={handleCheckout}
              className="w-full bg-[#9e1a1a] hover:bg-[#800000] text-white font-bold py-3 rounded-lg transition-colors shadow-md text-center"
            >
              Proceed to Buy
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default CartDrawer;
