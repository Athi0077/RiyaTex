import { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import api from '../api';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
// import bgImg from '../assets/background.webp';
import bgImg from '../assets/background2.webp';

function Shopping() {
  const { toggleWishlist, isWishlisted } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const fabricParam = searchParams.get('fabric') || 'All';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedColors, setSelectedColors] = useState({});
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts(fabricParam);
  }, [fabricParam]);

  const fetchProducts = async (fabric) => {
    setLoading(true);
    try {
      const response = await api.get(`/products?fabric=${fabric}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products', error);
      setProducts([]);
    }
    setLoading(false);
  };

  const handleAddToCart = (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    const selectedColorIndex = selectedColors[product._id] || 0;
    addToCart(product, selectedColorIndex);
  };

  return (
    <div className="min-h-[60vh] py-8 relative bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${bgImg})` }}>
      <div className="absolute inset-0 bg-white/30 z-0"></div>

      {/* Login Required Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center animate-in">
            <div className="text-5xl mb-4">🔐</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Login Required</h3>
            <p className="text-gray-500 text-sm mb-6">Please login first before adding items to your cart and making a purchase.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLoginModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowLoginModal(false); navigate('/login'); }}
                className="flex-1 py-2 px-4 bg-brand text-white rounded-lg font-bold hover:bg-brand-light transition-colors shadow-md"
              >
                Login / Register
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <input 
            type="text" 
            placeholder="Search..." 
            className="border border-gray-300 rounded-full px-6 py-2 w-full md:w-1/3 focus:outline-none focus:border-brand"
          />
          <div className="flex gap-4">
            <select 
              value={fabricParam} 
              onChange={(e) => setSearchParams({ fabric: e.target.value })}
              className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-brand bg-white"
            >
              <option value="All">All Products</option>
              <option value="Silk">Silk</option>
              <option value="Cotton">Cotton</option>
              <option value="Designed">Designed</option>
              <option value="Dothi">Dothi</option>
              <option value="Kids">Kids</option>
            </select>
            <Link to="/">
              <button className="bg-brand text-white px-8 py-2 rounded-full font-medium hover:bg-brand-light transition-colors">
                Home
              </button>
            </Link>
          </div>
        </div>

        <h2 className="text-4xl font-bold text-center text-brand mb-12">Shopping Page</h2>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center text-gray-500">Loading products...</div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.map(product => {
              // Determine which color index is currently selected for this product
              const selectedColorIndex = selectedColors[product._id] || 0;
              
              // Extract the image for the currently selected color variant
              let displayImage = 'https://placehold.co/400x300?text=No+Image';
              if (product.colorVariants && product.colorVariants.length > selectedColorIndex) {
                const variant = product.colorVariants[selectedColorIndex];
                if (variant.images && variant.images.length > 0) {
                  displayImage = variant.images[0];
                } else if (product.image) {
                  displayImage = product.image;
                }
              } else if (product.image) {
                displayImage = product.image;
              }

              // Use market price if available, else standard fallback
              const originalPrice = product.marketPrice ? product.marketPrice : (product.sellingPrice || product.price) * 1.5;

              return (
                <div key={product._id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col bg-white">
                  <div className="w-full h-64 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                    <Link to={`/product/${product._id}`} className="w-full h-full cursor-pointer">
                      <img 
                        src={displayImage} 
                        alt={product.name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=Image+Not+Found' }}
                      />
                    </Link>
                    <button 
                      onClick={() => toggleWishlist(product, selectedColorIndex)}
                      className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors group/heart"
                      title={isWishlisted(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <FiHeart 
                        size={18} 
                        className={isWishlisted(product._id) ? "fill-red-500 text-red-500" : ""} 
                      />
                    </button>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <span className="text-yellow-600 font-bold text-xs uppercase tracking-wider mb-1">
                      {product.status || 'Active'}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{product.fabric || product.category || 'Silk'}</p>
                    
                    {product.colorVariants && product.colorVariants.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Available Colors:</p>
                        <div className="flex gap-2 flex-wrap">
                          {product.colorVariants.map((variant, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedColors(prev => ({ ...prev, [product._id]: idx }))}
                              className={`w-6 h-6 rounded-full border-2 focus:outline-none transition-all ${selectedColorIndex === idx ? 'ring-2 ring-offset-2 ring-gray-400 border-white scale-110' : 'border-gray-200'}`}
                              style={{ backgroundColor: variant.hex || '#000' }}
                              title={variant.name}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-auto">
                      <div className="flex items-baseline mb-4">
                        <span className="text-[#c94121] font-bold text-2xl">₹{product.sellingPrice || product.price}</span>
                        <span className="line-through text-gray-400 text-sm ml-2">₹{originalPrice}</span>
                      </div>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-[#fce028] text-black px-4 py-2 rounded-full font-bold hover:bg-yellow-400 transition-colors shadow-sm"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-600 mt-20 text-lg">
            No products available
          </div>
        )}

      </div>
    </div>
  );
}

export default Shopping;
