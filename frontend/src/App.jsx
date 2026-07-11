import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import WishlistDrawer from './components/WishlistDrawer';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Shopping from './pages/Shopping';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminSarees from './pages/AdminSarees';
import AdminBookings from './pages/AdminBookings';
import Profile from './pages/Profile';
import './index.css';

function App() {
  return (
    <>
      <WishlistDrawer />
      <CartDrawer />
      <Routes>
      {/* Public Routes with Standard Layout */}
      <Route path="/" element={
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow flex flex-col">
            <Home />
          </main>
          <Footer />
        </div>
      } />
      <Route path="/shopping" element={
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow flex flex-col">
            <Shopping />
          </main>
          <Footer />
        </div>
      } />
      <Route path="/product/:id" element={
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow flex flex-col">
            <ProductDetails />
          </main>
          <Footer />
        </div>
      } />
      <Route path="/login" element={
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Login />
          </main>
          <Footer />
        </div>
      } />
      <Route path="/dashboard" element={
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Dashboard />
          </main>
          <Footer />
        </div>
      } />
      <Route path="/profile" element={
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Profile />
          </main>
          <Footer />
        </div>
      } />

      {/* Admin Routes with Admin Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="sarees" element={<AdminSarees />} />
        <Route path="bookings" element={<AdminBookings />} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
