import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import bgImg from '../assets/background3.webp';

function AdminLayout() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-8 z-1000">
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

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-gray-300 focus:outline-none"
              >
                {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#111] border-t border-gray-800 absolute w-full left-0 top-16 shadow-xl z-50">
            <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/admin" className="block px-3 py-3 text-base font-medium text-white hover:bg-gray-800 rounded-md">
                Dashboard
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/admin/sarees" className="block px-3 py-3 text-base font-medium text-white hover:bg-gray-800 rounded-md">
                Sarees
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/admin/bookings" className="block px-3 py-3 text-base font-medium text-white hover:bg-gray-800 rounded-md">
                Bookings
              </Link>
              <div className="pt-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-base font-semibold px-4 py-2.5 rounded-md transition-colors shadow"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow w-full relative z-10">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
