import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import api from '../api';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import bgImg from '../assets/background3.webp';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const { toggleWishlist, isWishlisted } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details', error);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
        <Link to="/shopping" className="text-brand hover:underline mt-4 inline-block">Back to Shopping</Link>
      </div>
    );
  }

  // Determine current image
  let displayImage = 'https://placehold.co/800x1000?text=No+Image';
  if (product.colorVariants && product.colorVariants[selectedColorIndex]) {
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

  const handleBuyNow = () => {
    addToCart(product, selectedColorIndex);
  };

  return (
    <div className="bg-white min-h-[80vh] py-12" style={{ backgroundImage: `url(${bgImg})` }}>
      <div className="absolute inset-0 bg-white/30 z-0"></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Left: Product Image */}
          <div className="md:w-1/2">
            <div className="relative rounded-2xl overflow-hidden shadow-md bg-gray-50 flex justify-center">
              <img 
                src={displayImage} 
                alt={product.name} 
                className="w-full h-auto max-h-[700px] object-cover"
                onError={(e) => { e.target.src = 'https://placehold.co/800x1000?text=Image+Not+Found' }}
              />
              <button 
                onClick={() => toggleWishlist(product, selectedColorIndex)}
                className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg text-gray-400 hover:text-red-500 transition-colors group/heart"
                title={isWishlisted(product._id) ? "Remove from wishlist" : "Add to wishlist"}
              >
                <FiHeart 
                  size={24} 
                  className={isWishlisted(product._id) ? "fill-red-500 text-red-500" : ""} 
                />
              </button>
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="md:w-1/2 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-sm text-gray-600 font-medium mb-6">
              Fabric: <span className="text-gray-800">{product.fabric || product.category}</span>
            </p>

            {/* Colors */}
            {product.colorVariants && product.colorVariants.length > 0 && (
              <div className="mb-8">
                <p className="text-sm font-bold text-gray-900 mb-3">Select Color:</p>
                <div className="flex gap-3">
                  {product.colorVariants.map((variant, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColorIndex(idx)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColorIndex === idx ? 'border-gray-900 scale-110 shadow-md' : 'border-gray-300'}`}
                      style={{ backgroundColor: variant.hex || '#000' }}
                      title={variant.colorName}
                    >
                      {selectedColorIndex === idx && (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-[#c94121]">₹{product.sellingPrice || product.price}</span>
              <span className="text-lg line-through text-gray-400">₹{originalPrice}</span>
            </div>

            {/* Status */}
            <div className="space-y-2 mb-10 text-sm">
              <p>
                <span className="font-bold text-gray-700">Status:</span>{' '}
                <span className={product.status === 'Active' ? 'text-green-600' : 'text-red-500'}>
                  {product.status || 'Active'}
                </span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {product.status === 'Inactive' ? (
                <button 
                  disabled
                  className="w-full bg-gray-300 text-gray-500 font-bold py-4 rounded-xl cursor-not-allowed text-lg text-center"
                >
                  Currently Unavailable
                </button>
              ) : (
                <button 
                  onClick={handleBuyNow}
                  className="w-full bg-[#9e1a1a] hover:bg-[#800000] text-white font-bold py-4 rounded-xl transition-colors shadow-lg text-lg text-center"
                >
                  Buy Now
                </button>
              )}
              
              <button 
                onClick={() => navigate('/shopping')}
                className="w-full bg-[#fce028] text-black font-bold py-4 rounded-xl hover:bg-yellow-400 transition-colors shadow-sm text-center"
              >
                Back to Shopping
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
