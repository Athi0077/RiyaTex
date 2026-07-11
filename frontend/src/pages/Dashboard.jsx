import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const STATUS_STYLES = {
  'Pending':          { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-400' },
  'Order confirmed':  { bg: 'bg-blue-100',   text: 'text-blue-800',   dot: 'bg-blue-500' },
  'Out for delivery': { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' },
  'Delivered':        { bg: 'bg-green-100',  text: 'text-green-800',  dot: 'bg-green-500' },
  'Cancelled':        { bg: 'bg-red-100',    text: 'text-red-800',    dot: 'bg-red-500' },
};

function Dashboard() {
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const email = localStorage.getItem('userEmail');
  const mobile = localStorage.getItem('userMobile');
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    const checkRole = async () => {
      try {
        const res = await api.get('/me');
        const latestRole = res.data.user.role;
        setRole(latestRole);
        localStorage.setItem('role', latestRole);
        if (latestRole === 'admin') {
          navigate('/admin');
        } else {
          fetchUserOrders();
        }
      } catch (error) {
        console.error('Failed to verify user profile', error);
      }
    };
    checkRole();
  }, [navigate]);

  const fetchUserOrders = async () => {
    try {
      const res = await api.get(`/bookings/user/${email}`);
      setOrders(res.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!email) return null;

  const totalSpent = orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.amount, 0);
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  const pendingCount = orders.filter(o => o.status === 'Pending').length;

  return (
    <div className="min-h-[60vh] bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow">
              {email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>
              <p className="text-gray-500 text-sm">{email}</p>
              {mobile && <p className="text-gray-400 text-xs mt-0.5">📱 +91 {mobile}</p>}
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link to="/profile">
              <button className="px-4 py-2 border border-brand text-brand rounded-full text-sm font-semibold hover:bg-pink-50 transition-colors">
                ✏️ Edit Profile
              </button>
            </Link>
            <Link to="/shopping">
              <button className="px-4 py-2 bg-brand text-white rounded-full text-sm font-semibold hover:bg-brand-light transition-colors shadow">
                🛍️ Shop Now
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-red-300 text-red-500 rounded-full text-sm font-semibold hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 text-center">
            <p className="text-3xl font-bold text-brand">{orders.length}</p>
            <p className="text-gray-500 text-sm mt-1">Total Orders</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 text-center">
            <p className="text-3xl font-bold text-green-600">₹{totalSpent}</p>
            <p className="text-gray-500 text-sm mt-1">Total Spent</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 text-center">
            <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
            <p className="text-gray-500 text-sm mt-1">Pending Orders</p>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">📦 Order History</h2>
            <span className="text-sm text-gray-400">{deliveredCount} delivered</span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🛍️</div>
              <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
              <Link to="/shopping">
                <button className="mt-6 px-8 py-3 bg-brand text-white rounded-full font-bold hover:bg-brand-light transition-colors shadow">
                  Start Shopping
                </button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 text-left">#</th>
                    <th className="px-6 py-4 text-left">Date</th>
                    <th className="px-6 py-4 text-left">Saree</th>
                    <th className="px-6 py-4 text-left">Qty</th>
                    <th className="px-6 py-4 text-left">Amount</th>
                    <th className="px-6 py-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order, i) => {
                    const style = STATUS_STYLES[order.status] || STATUS_STYLES['Pending'];
                    return (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-400">{i + 1}</td>
                        <td className="px-6 py-4 text-gray-600">{order.date}</td>
                        <td className="px-6 py-4 font-medium text-gray-800">{order.sareeName}</td>
                        <td className="px-6 py-4 text-gray-600">×{order.qty}</td>
                        <td className="px-6 py-4 font-bold text-gray-800">₹{order.amount}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
