import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiX, FiFolder } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api';
import Pagination from '../components/Pagination';

function AdminSarees() {
  const [sarees, setSarees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [variants, setVariants] = useState([{ id: Date.now(), name: '', hex: '#000000' }]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Form State
  const [name, setName] = useState('');
  const [fabric, setFabric] = useState('');
  const [marketPrice, setMarketPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [stock, setStock] = useState('');
  const [quantity, setQuantity] = useState('');
  const [status, setStatus] = useState('Active');

  useEffect(() => {
    fetchSarees();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const fetchSarees = async () => {
    try {
      const res = await api.get('/products');
      setSarees(res.data);
    } catch (error) {
      console.error('Error fetching sarees', error);
    }
  };

  const addVariant = () => {
    setVariants([...variants, { id: Date.now(), name: '', hex: '#000000' }]);
  };

  const removeVariant = (id) => {
    if (variants.length > 1) {
      setVariants(variants.filter(v => v.id !== id));
    }
  };

  const updateVariant = (id, field, value) => {
    setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleImageUpload = async (id, files) => {
    if (files && files.length > 0) {
      const formData = new FormData();
      Array.from(files).forEach(f => formData.append('images', f));

      try {
        const response = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        // Return array of objects for the UI
        const fileData = response.data.urls.map(url => ({
          preview: url,
          url: url
        }));

        const variant = variants.find(v => v.id === id);
        const existingImages = variant.images || [];
        updateVariant(id, 'images', [...existingImages, ...fileData]);
      } catch (err) {
        console.error("Error uploading files", err);
        toast.error("Failed to upload images. Please check backend connection.");
      }
    }
  };

  const removeImage = (variantId, indexToRemove) => {
    const variant = variants.find(v => v.id === variantId);
    if (variant && variant.images) {
      const newImages = variant.images.filter((_, idx) => idx !== indexToRemove);
      updateVariant(variantId, 'images', newImages);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setName("");
    setFabric("");
    setMarketPrice("");
    setSellingPrice("");
    setStock("");
    setQuantity("");
    setStatus("Active");
    setVariants([{ id: Date.now(), name: '', hex: '#000000' }]);
  };

  const handleEditClick = (saree) => {
    setEditingId(saree._id);
    setName(saree.name || '');
    setFabric(saree.fabric || '');
    setMarketPrice(saree.marketPrice || '');
    setSellingPrice(saree.sellingPrice || '');
    setStock(saree.stock || '');
    setQuantity(saree.quantity || '');
    setStatus(saree.status || 'Active');
    
    if (saree.colorVariants && saree.colorVariants.length > 0) {
      const formattedVariants = saree.colorVariants.map((v, idx) => ({
        id: Date.now() + idx,
        name: v.colorName || v.name || '',
        hex: v.hex || '#000000',
        images: v.images ? v.images.map(img => ({ url: img, preview: img })) : []
      }));
      setVariants(formattedVariants);
    } else {
      setVariants([{ id: Date.now(), name: '', hex: '#000000' }]);
    }
    setIsModalOpen(true);
  };

  const handleSaveSaree = async () => {
    try {
      const formattedVariants = variants.map(v => ({
        ...v,
        images: v.images ? v.images.map(img => typeof img === 'string' ? img : img.url) : []
      }));

      const payload = {
        name,
        fabric,
        marketPrice: Number(marketPrice),
        sellingPrice: Number(sellingPrice),
        stock: Number(stock),
        quantity: Number(quantity),
        status,
        colorVariants: formattedVariants
      };
      
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success('Saree updated successfully!');
      } else {
        await api.post('/products', payload);
        toast.success('Saree added successfully!');
      }

      closeModal();
      fetchSarees();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save saree. Ensure backend is connected.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this saree?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Saree deleted successfully!');
        fetchSarees();
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete.');
      }
    }
  };

  const filteredSarees = sarees.filter(s =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.fabric?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSarees.length / itemsPerPage);
  const currentSarees = filteredSarees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      
      <h1 className="text-3xl font-bold text-center text-[#9e1a1a] mb-8">Sarees Management</h1>
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search by name or fabric..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-full px-5 py-2 w-full sm:w-72 focus:outline-none focus:border-brand bg-white text-sm"
        />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded shadow transition-colors flex items-center gap-2"
        >
          <span>+ Add Saree</span>
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                <th className="py-4 px-6">Image</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Fabric</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Edit/Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {filteredSarees.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-4 text-center text-gray-500">
                    {searchQuery ? `No sarees found for "${searchQuery}"` : 'No sarees available'}
                  </td>
                </tr>
              )}
              {currentSarees.map((saree) => (
                <tr key={saree._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-6">
                    <div className="w-12 h-16 bg-gray-200 rounded shadow-sm border border-gray-200 flex items-center justify-center text-xs text-gray-400">Img</div>
                  </td>
                  <td className="py-3 px-6 text-gray-800">{saree.name}</td>
                  <td className="py-3 px-6 text-gray-600">{saree.fabric}</td>
                  <td className="py-3 px-6 text-gray-800">₹{saree.sellingPrice}</td>
                  <td className="py-3 px-6 text-gray-600">{saree.status}</td>
                  <td className="py-3 px-6 text-gray-500 flex space-x-3 mt-4">
                    <button onClick={() => handleEditClick(saree)} className="hover:text-blue-600 transition-colors" title="Edit">
                      <FiEdit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(saree._id)} className="hover:text-red-600 transition-colors" title="Delete">
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {currentSarees.length > 0 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Add Saree Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f172a] w-full max-w-2xl rounded-lg shadow-2xl flex flex-col max-h-[90vh] border border-gray-700">
            
            <div className="flex justify-between items-center p-6 pb-2">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Saree' : 'Add Saree'}</h2>
              <button 
                onClick={closeModal}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-colors shadow-lg"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-grow">
              
              <div className="grid grid-cols-1 gap-4">
                <input type="text" placeholder="Saree Name" value={name} onChange={(e) => setName(e.target.value)} className="bg-[#1e293b] text-white border-none rounded p-4 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                <select value={fabric} onChange={(e) => setFabric(e.target.value)} className="bg-[#1e293b] text-white border-none rounded p-4 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="" disabled>Select Fabric</option>
                  <option value="Silk">Silk</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Designed">Designed</option>
                  <option value="Dothi">Dothi</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Market Price" value={marketPrice} onChange={(e) => setMarketPrice(e.target.value)} className="bg-[#1e293b] text-white border-none rounded p-4 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                <input type="number" placeholder="Selling Price" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} className="bg-[#1e293b] text-white border-none rounded p-4 focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>

              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-[#1e293b] text-white border-none rounded p-4 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <div className="pt-6">
                <h3 className="text-lg font-bold text-white mb-4">Color Variants</h3>
                
                <div className="space-y-4 mb-6">
                  {variants.map((variant, index) => (
                    <div key={variant.id} className="bg-[#1e293b] p-6 rounded-lg border border-[#334155]">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-white">Variant {index + 1}</h4>
                        <button onClick={() => removeVariant(variant.id)} className="text-red-500 text-sm hover:underline">
                          Remove Variant
                        </button>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-6 mb-6">
                        <div className="flex-grow flex items-end">
                          <input 
                            type="text" 
                            placeholder="Color Name (e.g. Pink)" 
                            value={variant.name}
                            onChange={(e) => updateVariant(variant.id, 'name', e.target.value)}
                            className="w-full bg-transparent border-b border-gray-600 text-white pb-2 focus:outline-none focus:border-blue-500" 
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-300">Color:</span>
                          <input 
                            type="color" 
                            value={variant.hex}
                            onChange={(e) => updateVariant(variant.id, 'hex', e.target.value)}
                            className="w-10 h-10 rounded cursor-pointer border-0 p-0 bg-transparent" 
                          />
                        </div>
                      </div>

                      <div>
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*"
                          onChange={(e) => handleImageUpload(variant.id, e.target.files)}
                          className="hidden"
                          id={`file-upload-${variant.id}`}
                        />
                        <label 
                          htmlFor={`file-upload-${variant.id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors shadow cursor-pointer w-max"
                        >
                          <FiFolder size={16} /> Upload Images
                        </label>
                        {variant.images && variant.images.length > 0 ? (
                          <div className="flex flex-wrap gap-4 mt-4">
                            {variant.images.map((img, idx) => (
                              <div key={idx} className="relative w-20 h-20 border border-gray-600 rounded overflow-hidden shadow-sm">
                                <img src={typeof img === 'string' ? img : img.preview} alt="preview" className="w-full h-full object-cover" />
                                <button 
                                  onClick={() => removeImage(variant.id, idx)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 shadow hover:bg-red-600 transition-colors"
                                >
                                  <FiX size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 mt-3">No images added yet.</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={addVariant}
                  className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3 rounded transition-colors shadow-md"
                >
                  + Add Color Variant
                </button>
              </div>

            </div>

            <div className="p-6 pt-2">
              <button 
                onClick={handleSaveSaree}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded transition-colors shadow-md"
              >
                {editingId ? 'Update Saree' : 'Save Saree'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default AdminSarees;
