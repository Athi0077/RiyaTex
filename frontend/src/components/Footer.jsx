import { useState } from "react";
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from "react-icons/fi";

function Footer() {
  const [feedbackEmail, setFeedbackEmail] = useState("");

  const sendWhatsApp = () => {
    const message = `Feedback from ${localStorage.getItem("userEmail") || feedbackEmail || "a user"}: ${feedbackEmail}`;
    const whatsappUrl = `https://wa.me/8056510875?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    setFeedbackEmail("");
  }

  const joinWhatsappGroup = () => {
    const message = `Hi, I would like to join the Riya Tex WhatsApp group!`;
    const whatsappUrl = `https://wa.me/6379981170?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <footer className="bg-[#111111] text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-widest text-pink-500 mb-4">RIYA TEX</h2>
          <p className="text-sm leading-relaxed text-gray-400">
            Discover elegance with our exclusive saree collections.
            Crafted for every occasion.
          </p>
        </div>

        {/* Shop Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-pink-500 cursor-pointer transition-colors">Silk Sarees</li>
            <li className="hover:text-pink-500 cursor-pointer transition-colors">Designer Sarees</li>
            <li className="hover:text-pink-500 cursor-pointer transition-colors">Wedding Collection</li>
            <li className="hover:text-pink-500 cursor-pointer transition-colors">New Arrivals</li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-pink-500 cursor-pointer transition-colors">Contact Us</li>
            <li className="hover:text-pink-500 cursor-pointer transition-colors">Return Policy</li>
            <li className="hover:text-pink-500 cursor-pointer transition-colors">Shipping Info</li>
            <li className="hover:text-pink-500 cursor-pointer transition-colors">FAQs</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-2">Feedback</h3>
          <p className="text-sm text-gray-400">We'd love to hear your thoughts!</p>
          <div className="flex">
            <input 
              type="text" 
              placeholder="Enter your feedback" 
              className="px-4 py-2 w-full text-black outline-none"
              value={feedbackEmail}
              onChange={(e) => setFeedbackEmail(e.target.value)} 
            />
            <button 
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 font-medium transition-colors"
              onClick={sendWhatsApp}
            >
              Send
            </button>
          </div>
          <button 
            className="text-white hover:text-pink-400 text-sm font-medium transition-colors" 
            onClick={joinWhatsappGroup}
          >
            Join Our Community
          </button>
          
          <div className="flex space-x-4 pt-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><FiFacebook size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><FiInstagram size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><FiTwitter size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><FiYoutube size={20} /></a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
        <p>© 2026 RIYA TEX. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
