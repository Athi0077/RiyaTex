import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import { FiArrowLeft } from "react-icons/fi";

function Profile() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    loadProfile();
  }, [navigate]);

  const loadProfile = async () => {
    try {
      const res = await api.get('/me');
      setEmail(res.data.user.email || '');
      setMobile(res.data.user.mobile || '');
    } catch {
      toast.error('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/me', { mobile });
      localStorage.setItem('userMobile', res.data.user.mobile || '');
      toast.success('Profile updated successfully! ✅');
    } catch {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-gray-500 text-lg animate-pulse">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-gradient-to-br from-pink-50 to-purple-50 py-16 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg">
            {email.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-500 mt-1">Manage your account details</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <form onSubmit={handleSave} className="space-y-6">

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
              <div className="flex">
                <span className="inline-flex items-center px-4 border border-r-0 border-gray-200 rounded-l-xl bg-gray-50 text-gray-500 text-sm">+91</span>
                <input
                  type="tel"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  placeholder="Enter your mobile number"
                  maxLength={10}
                  className="flex-1 border border-gray-200 rounded-r-xl px-4 py-3 focus:outline-none focus:border-brand"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsCartOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#8f0000] text-white hover:bg-[#730000] transition-all duration-300 shadow-md">
                <FiArrowLeft size={18} />
                <span className="text-sm font-medium">Back</span>
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 bg-brand text-white rounded-xl font-bold hover:bg-brand-light transition-colors shadow-md disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
