import { useState, useEffect } from 'react';
import api from '../api';

const STATUS_STYLES = {
  'Pending':          { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
  'Order confirmed':  { bg: 'bg-blue-100',   text: 'text-blue-800',   border: 'border-blue-300' },
  'Out for delivery': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
  'Delivered':        { bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-green-300' },
  'Cancelled':        { bg: 'bg-red-100',    text: 'text-red-800',    border: 'border-red-300' },
};

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, cancelled: 0, revenue: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      const data = res.data;
      setBookings(data);
      const total = data.length;
      const cancelled = data.filter(b => b.status === 'Cancelled').length;
      const revenue = data.filter(b => b.status !== 'Cancelled').reduce((sum, b) => sum + (b.amount || 0), 0);
      setStats({ total, cancelled, revenue });
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/bookings/${id}`, { status: newStatus });
      fetchBookings();
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await api.delete(`/bookings/${id}`);
        fetchBookings();
      } catch (error) {
        alert('Failed to delete');
      }
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchSearch = !searchQuery ||
      b.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.sareeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.mobile?.includes(searchQuery);
    const matchStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <h1 className="text-3xl font-bold text-center text-[#9e1a1a] mb-8">Bookings Management</h1>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/70 backdrop-blur-md p-5 border border-white/50 rounded-xl shadow-sm text-center">
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
          <p className="text-gray-500 text-sm mt-1">Total Bookings</p>
        </div>
        <div className="bg-white/70 backdrop-blur-md p-5 border border-white/50 rounded-xl shadow-sm text-center">
          <p className="text-3xl font-bold text-red-500">{stats.cancelled}</p>
          <p className="text-gray-500 text-sm mt-1">Cancelled</p>
        </div>
        <div className="bg-white/70 backdrop-blur-md p-5 border border-white/50 rounded-xl shadow-sm text-center">
          <p className="text-3xl font-bold text-green-600">₹{stats.revenue}</p>
          <p className="text-gray-500 text-sm mt-1">Revenue</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="🔍 Search by email, name, or mobile..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-full px-5 py-2 flex-1 focus:outline-none focus:border-brand bg-white text-sm"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-full px-5 py-2 focus:outline-none focus:border-brand bg-white text-sm"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Order confirmed">Order confirmed</option>
          <option value="Out for delivery">Out for delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                <th className="py-4 px-4">No</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Mobile</th>
                <th className="py-4 px-4">Saree</th>
                <th className="py-4 px-4">Qty</th>
                <th className="py-4 px-4">Amount</th>
                <th className="py-4 px-4">Payment</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="10" className="py-8 text-center text-gray-500">
                    {searchQuery || statusFilter !== 'All' ? 'No bookings match your search.' : 'No bookings available'}
                  </td>
                </tr>
              )}
              {filteredBookings.map((b, index) => {
                const style = STATUS_STYLES[b.status] || STATUS_STYLES['Pending'];
                return (
                  <tr key={b._id} className="hover:bg-white/60 transition-colors">
                    <td className="py-3 px-4 text-gray-400">{index + 1}</td>
                    <td className="py-3 px-4 text-gray-800 text-xs">{b.customerEmail}</td>
                    <td className="py-3 px-4 text-gray-600">{b.mobile || 'N/A'}</td>
                    <td className="py-3 px-4 text-gray-800 font-medium">{b.sareeName}</td>
                    <td className="py-3 px-4 text-gray-600">{b.qty}</td>
                    <td className="py-3 px-4 text-gray-800 font-bold">₹{b.amount}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs text-white ${b.paymentType === 'cod' ? 'bg-[#8B4513]' : 'bg-[#198754]'}`}>
                        {b.paymentType === 'cod' ? 'COD' : 'Online'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{b.date}</td>
                    <td className="py-3 px-4">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b._id, e.target.value)}
                        className={`border rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none ${style.bg} ${style.text} ${style.border}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Order confirmed">Order confirmed</option>
                        <option value="Out for delivery">Out for delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="border border-red-200 bg-white text-red-500 hover:bg-red-50 px-3 py-1 rounded text-xs transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminBookings;
