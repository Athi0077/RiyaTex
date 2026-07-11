import { useState, useEffect } from 'react';
import api from '../api';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, cancelled: 0, revenue: 0 });

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
      fetchBookings(); // Refresh the list and stats
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
        console.error('Failed to delete booking', error);
        alert('Failed to delete');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <h1 className="text-3xl font-bold text-center text-[#9e1a1a] mb-8">Bookings Management</h1>
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm text-gray-700 font-medium">
          Total: {stats.total}
        </div>
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm text-gray-700 font-medium">
          Cancelled: {stats.cancelled}
        </div>
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm text-gray-700 font-medium">
          Revenue: ₹{stats.revenue}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                <th className="py-4 px-4">No</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Mobile No</th>
                <th className="py-4 px-4">Saree</th>
                <th className="py-4 px-4">Quantity</th>
                <th className="py-4 px-4">Amount</th>
                <th className="py-4 px-4">Payment</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {bookings.length === 0 && (
                <tr>
                  <td colSpan="10" className="py-4 text-center text-gray-500">No bookings available</td>
                </tr>
              )}
              {bookings.map((b, index) => (
                <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                  <td className="py-3 px-4 text-gray-800">{b.customerEmail}</td>
                  <td className="py-3 px-4 text-gray-600">{b.mobile || 'N/A'}</td>
                  <td className="py-3 px-4 text-gray-800">{b.sareeName}</td>
                  <td className="py-3 px-4 text-gray-600">{b.qty}</td>
                  <td className="py-3 px-4 text-gray-800">₹{b.amount}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs text-white ${b.paymentType === 'cod' ? 'bg-[#8B4513]' : 'bg-[#198754]'}`}>
                      {b.paymentType === 'cod' ? 'Cash On Delivery' : 'Online'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{b.date}</td>
                  <td className="py-3 px-4">
                    <select 
                      value={b.status}
                      onChange={(e) => handleStatusChange(b._id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:border-gray-400"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Order confirmed">Order confirmed</option>
                      <option value="Out for delivery">Out for delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => handleDelete(b._id)} className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 px-3 py-1 rounded text-xs transition-colors">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminBookings;
