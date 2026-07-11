import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await axios.post('http://localhost:5000/api/register', { email, password, mobile });
        // Auto-login after registration
        const response = await axios.post('http://localhost:5000/api/login', { email, password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.user.role);
        localStorage.setItem('userEmail', response.data.user.email);
        localStorage.setItem('userMobile', response.data.user.mobile || '');
        navigate('/');
      } else {
        const response = await axios.post('http://localhost:5000/api/login', { email, password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.user.role);
        localStorage.setItem('userEmail', response.data.user.email);
        localStorage.setItem('userMobile', response.data.user.mobile || '');
        if (response.data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-brand mb-6">
          {isRegister ? 'Register' : 'Login'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <input 
                type="tel" 
                required
                placeholder="e.g. 9876543210"
                pattern="[0-9]{10}"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">Enter 10-digit mobile number</p>
            </div>
          )}
          <button 
            type="submit" 
            className="w-full bg-brand text-white py-2 rounded font-medium hover:bg-brand-light transition-colors"
          >
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          {isRegister ? 'Already have an account? ' : 'Don\'t have an account? '}
          <button 
            onClick={() => { setIsRegister(!isRegister); setMobile(''); }} 
            className="text-brand font-medium hover:underline"
          >
            {isRegister ? 'Login here' : 'Register here'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
