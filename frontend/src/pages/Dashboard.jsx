import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Dashboard() {
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const email = localStorage.getItem('userEmail');
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-[60vh]">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
        <div className="flex justify-between items-center border-b pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
          </h1>
          <button 
            onClick={handleLogout}
            className="text-red-500 font-medium hover:text-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="mb-8">
          <p className="text-lg text-gray-700">
            Welcome back, <span className="font-semibold">{email}</span>
          </p>
          <p className="text-gray-500 mt-2">Current Role: <span className="uppercase font-medium text-brand">{role}</span></p>
        </div>



        {role === 'user' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Order List</h2>
            {orders.length === 0 ? (
              <p className="text-gray-500">You have no orders yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saree</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.sareeName} (x{order.qty})</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
