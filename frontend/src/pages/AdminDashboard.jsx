import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeSarees: 0,
    recentBookings: []
  });
  
  // Since we fetch sarees directly, we can get top 3 or just use a standard endpoint
  const [sareesOverview, setSareesOverview] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchSareesOverview();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  };

  const fetchSareesOverview = async () => {
    try {
      const res = await api.get('/products');
      setSareesOverview(res.data.slice(0, 5)); // Just show 5
    } catch (error) {
      console.error('Failed to fetch sarees', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-10 mt-4">
        <h1 className="text-4xl font-bold text-[#9e1a1a] mb-6 flex items-center justify-center gap-2">
          Good morning, Riya Sarees Admin <span className="text-3xl">👋</span>
        </h1>
        <p className="text-gray-600 text-left">Here's what's happening in your store today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/70 backdrop-blur-md p-6 border border-white/50 rounded-lg shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Total Orders</h3>
          <p className="text-gray-600 text-xl">{stats.totalOrders}</p>
        </div>
        <div className="bg-white/70 backdrop-blur-md p-6 border border-white/50 rounded-lg shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Total Revenue</h3>
          <p className="text-gray-600 text-xl">₹{stats.totalRevenue}</p>
        </div>
        <div className="bg-white/70 backdrop-blur-md p-6 border border-white/50 rounded-lg shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Active Sarees</h3>
          <p className="text-gray-600 text-xl">{stats.activeSarees}</p>
        </div>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Bookings */}
        <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-lg shadow-sm overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-blue-500 text-sm hover:underline">View all →</Link>
          </div>
          <div className="p-6 space-y-6">
            {stats.recentBookings.length === 0 && <p className="text-gray-500">No bookings yet.</p>}
            {stats.recentBookings.map(booking => (
              <div key={booking._id} className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm text-gray-800">{booking.customerEmail}</h4>
                  <p className="text-xs text-gray-500 mt-1">{booking.sareeName} • Qty {booking.qty}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="bg-[#1a365d] text-white text-xs px-2 py-1 rounded font-medium">₹{booking.amount}</span>
                  <span className="bg-gray-500 text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-wider">{booking.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sarees Overview */}
        <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-lg shadow-sm overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Sarees Overview</h2>
            <Link to="/admin/sarees" className="text-blue-500 text-sm hover:underline">View all →</Link>
          </div>
          <div className="p-6 space-y-6">
            {sareesOverview.length === 0 && <p className="text-gray-500">No sarees yet.</p>}
            {sareesOverview.map(saree => (
              <div key={saree._id} className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img src={saree.image || 'https://via.placeholder.com/50'} alt={saree.name} className="w-12 h-12 object-cover rounded shadow-sm border border-gray-200" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-800">{saree.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{saree.fabric}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="bg-[#1a365d] text-white text-xs px-2 py-1 rounded font-medium">₹{saree.sellingPrice || saree.marketPrice || 0}</span>
                  <span className="bg-[#10b981] text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-wider">{saree.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
