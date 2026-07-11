import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeSarees: 0,
    recentBookings: []
  });
  const [sareesOverview, setSareesOverview] = useState([]);
  const [allBookings, setAllBookings] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchSareesOverview();
    fetchAllBookings();
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
      setSareesOverview(res.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch sarees', error);
    }
  };

  const fetchAllBookings = async () => {
    try {
      const res = await api.get('/bookings');
      setAllBookings(res.data);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    }
  };

  // Build chart data from allBookings
  const statusCounts = ['Pending', 'Order confirmed', 'Out for delivery', 'Delivered', 'Cancelled'].map(status => ({
    name: status === 'Order confirmed' ? 'Confirmed' : status === 'Out for delivery' ? 'Delivery' : status,
    count: allBookings.filter(b => b.status === status).length,
    color: status === 'Delivered' ? '#10b981' : status === 'Cancelled' ? '#ef4444' : status === 'Pending' ? '#f59e0b' : status === 'Out for delivery' ? '#f97316' : '#3b82f6'
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-10 mt-4">
        <h1 className="text-4xl font-bold text-[#9e1a1a] mb-2 flex items-center justify-center gap-2">
          Good morning, Riya Sarees Admin <span className="text-3xl">👋</span>
        </h1>
        <p className="text-gray-600">Here's what's happening in your store today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/70 backdrop-blur-md p-6 border border-white/50 rounded-xl shadow-sm text-center">
          <p className="text-4xl font-bold text-brand">{stats.totalOrders}</p>
          <h3 className="text-gray-600 font-medium mt-1">Total Orders</h3>
        </div>
        <div className="bg-white/70 backdrop-blur-md p-6 border border-white/50 rounded-xl shadow-sm text-center">
          <p className="text-4xl font-bold text-green-600">₹{stats.totalRevenue}</p>
          <h3 className="text-gray-600 font-medium mt-1">Total Revenue</h3>
        </div>
        <div className="bg-white/70 backdrop-blur-md p-6 border border-white/50 rounded-xl shadow-sm text-center">
          <p className="text-4xl font-bold text-purple-600">{stats.activeSarees}</p>
          <h3 className="text-gray-600 font-medium mt-1">Active Sarees</h3>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="mb-8 bg-white/70 backdrop-blur-md border border-white/50 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">📊 Orders by Status</h2>
        {allBookings.length === 0 ? (
          <p className="text-gray-400 text-sm py-8 text-center">No order data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statusCounts} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value) => [value, 'Orders']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {statusCounts.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Recent Bookings + Sarees Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Recent Bookings */}
        <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-xl shadow-sm overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-blue-500 text-sm hover:underline">View all →</Link>
          </div>
          <div className="p-6 space-y-4">
            {stats.recentBookings.length === 0 && <p className="text-gray-500 text-sm">No bookings yet.</p>}
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
        <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-xl shadow-sm overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Sarees Overview</h2>
            <Link to="/admin/sarees" className="text-blue-500 text-sm hover:underline">View all →</Link>
          </div>
          <div className="p-6 space-y-4">
            {sareesOverview.length === 0 && <p className="text-gray-500 text-sm">No sarees yet.</p>}
            {sareesOverview.map(saree => {
              const img = saree.colorVariants?.[0]?.images?.[0] || saree.image || null;
              return (
                <div key={saree._id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {img
                      ? <img src={img} alt={saree.name} loading="lazy" className="w-10 h-12 object-cover rounded shadow-sm border border-gray-200" />
                      : <div className="w-10 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">IMG</div>
                    }
                    <div>
                      <h4 className="font-bold text-sm text-gray-800">{saree.name}</h4>
                      <p className="text-xs text-gray-500">{saree.fabric}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="bg-[#1a365d] text-white text-xs px-2 py-1 rounded font-medium">₹{saree.sellingPrice || 0}</span>
                    <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold ${saree.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {saree.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
