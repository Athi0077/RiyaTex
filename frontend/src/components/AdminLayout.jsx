import { Link, Outlet, useNavigate } from 'react-router-dom';
import bgImg from '../assets/background3.webp';

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userMobile');
    navigate('/login');
  };
  return (
    <div style={{ backgroundImage: `url(${bgImg})` }} className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex flex-col relative bg-cover bg-center bg-fixed">
      <div className="absolute inset-0 bg-white/50 z-0"></div>
      
      {/* Admin Header */}
      <header className="bg-[#111] text-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/admin" className="text-xl font-bold tracking-wide">
                Riya Sarees
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-8">
              <Link to="/admin" className="text-sm font-medium hover:text-gray-300 transition-colors">
                Dashboard
              </Link>
              <Link to="/admin/sarees" className="text-sm font-medium hover:text-gray-300 transition-colors">
                Sarees
              </Link>
              <Link to="/admin/bookings" className="text-sm font-medium hover:text-gray-300 transition-colors">
                Bookings
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-1.5 rounded-full transition-colors shadow"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow w-full relative z-10">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
