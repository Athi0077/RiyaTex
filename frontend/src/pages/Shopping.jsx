import { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiSearch } from 'react-icons/fi';
import api from '../api';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import Pagination from '../components/Pagination';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts(fabricParam);
    setCurrentPage(1); // Reset page on fabric change
  }, [fabricParam]);

  // Reset page when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOrder]);

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

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    const selectedColorIndex = selectedColors[product._id] || 0;
    addToCart(product, selectedColorIndex);
  };

  // Filter + Sort products
  const displayedProducts = products
    .filter(p => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.name?.toLowerCase().includes(q) ||
        p.fabric?.toLowerCase().includes(q) ||
        p.colorVariants?.some(v => v.name?.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortOrder === 'low') return (a.sellingPrice || 0) - (b.sellingPrice || 0);
      if (sortOrder === 'high') return (b.sellingPrice || 0) - (a.sellingPrice || 0);
      return 0;
    });

  const totalPages = Math.ceil(displayedProducts.length / itemsPerPage);
  const currentProducts = displayedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (product) => {
    if (product.status === 'Inactive') return { label: 'Unavailable', color: 'bg-red-500' };
    return null;
  };

  return (
    <div className="min-h-[60vh] py-8 relative bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${bgImg})` }}>
      <div className="absolute inset-0 bg-white/30 z-0"></div>

      {/* Login Required Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
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
          {/* Search Bar */}
          <div className="relative w-full md:w-1/3">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, fabric, color..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-full pl-10 pr-6 py-2 w-full focus:outline-none focus:border-brand bg-white/80 backdrop-blur-sm"
            />
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            {/* Sort */}
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-brand bg-white/80 backdrop-blur-sm"
            >
              <option value="default">Sort: Default</option>
              <option value="low">Price: Low → High</option>
              <option value="high">Price: High → Low</option>
            </select>
            {/* Fabric Filter */}
            <select
              value={fabricParam}
              onChange={(e) => setSearchParams({ fabric: e.target.value })}
              className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-brand bg-white/80 backdrop-blur-sm"
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-xl bg-white/60 animate-pulse h-80"></div>
            ))}
          </div>
        ) : currentProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-8">
            {currentProducts.map(product => {
              const selectedColorIndex = selectedColors[product._id] || 0;

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

              const originalPrice = product.marketPrice ? product.marketPrice : (product.sellingPrice || product.price) * 1.5;
              const statusBadge = getStatusBadge(product);
              const isInactive = product.status === 'Inactive';

              return (
                <div 
                  key={product._id} 
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col bg-white cursor-pointer"
                >
                  <div className="w-full h-48 sm:h-64 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                    <div className="w-full h-full overflow-hidden">
                      <img
                        src={displayImage}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=Image+Not+Found' }}
                      />
                    </div>
                    {/* Wishlist button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleWishlist(product, selectedColorIndex);
                      }}
                      className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors"
                      title={isWishlisted(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <FiHeart size={18} className={isWishlisted(product._id) ? "fill-red-500 text-red-500" : ""} />
                    </button>
                    {/* Status Badge */}
                    {statusBadge && (
                      <span className={`absolute top-3 left-3 ${statusBadge.color} text-white text-[10px] font-bold px-2 py-1 rounded-full shadow`}>
                        {statusBadge.label}
                      </span>
                    )}
                  </div>

                  <div className="p-3 sm:p-5 flex flex-col flex-grow">
                    <span className="text-yellow-600 font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-1">
                      {product.status || 'Active'}
                    </span>
                    <h3 className="text-sm sm:text-xl font-bold text-gray-900 leading-tight mb-0.5 line-clamp-2">{product.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">{product.fabric || product.category || 'Silk'}</p>
                    <p className="text-[10px] sm:text-xs text-green-600 font-medium mb-2 sm:mb-3">✓ Unstitched Blouse</p>

                    {product.colorVariants && product.colorVariants.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Available Colors:</p>
                        <div className="flex gap-2 flex-wrap">
                          {product.colorVariants.map((variant, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setSelectedColors(prev => ({ ...prev, [product._id]: idx }));
                              }}
                              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 focus:outline-none transition-all ${selectedColorIndex === idx ? 'ring-2 ring-offset-1 sm:ring-offset-2 ring-gray-400 border-white scale-110' : 'border-gray-200'}`}
                              style={{ backgroundColor: variant.hex || '#000' }}
                              title={variant.name}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-auto">
                      <div className="flex items-baseline mb-2 sm:mb-4 flex-wrap">
                        <span className="text-[#c94121] font-bold text-lg sm:text-2xl">₹{product.sellingPrice || product.price}</span>
                        <span className="line-through text-gray-400 text-xs sm:text-sm ml-1 sm:ml-2">₹{originalPrice}</span>
                      </div>
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={isInactive}
                        className={`w-full px-2 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-base transition-colors shadow-sm ${isInactive ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#fce028] text-black hover:bg-yellow-400'}`}
                      >
                        {isInactive ? 'Unavailable' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center mt-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 text-lg">No products found{searchQuery ? ` for "${searchQuery}"` : ''}.</p>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="mt-4 text-brand underline text-sm">Clear search</button>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && currentProducts.length > 0 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

      </div>
    </div>
  );
}

export default Shopping;
