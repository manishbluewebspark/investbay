// import React, { useState } from 'react';
// import axios from 'axios';
// import { X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

// export default function SubscribeModal({ isOpen, onClose }) {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState({ type: '', message: '' });
  
//   const apiUrl = import.meta.env.VITE_API_URL;

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//     // Clear status when user types
//     if (status.message) setStatus({ type: '', message: '' });
//   };

//   const validateForm = () => {
//     if (!formData.name.trim()) {
//       setStatus({ type: 'error', message: 'Name is required' });
//       return false;
//     }
//     if (!formData.email.trim()) {
//       setStatus({ type: 'error', message: 'Email is required' });
//       return false;
//     }
//     if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       setStatus({ type: 'error', message: 'Please enter a valid email' });
//       return false;
//     }
//     if (!formData.phone.trim()) {
//       setStatus({ type: 'error', message: 'WhatsApp number is required' });
//       return false;
//     }
//     // Basic phone validation (10-15 digits, optional +)
//     const phoneRegex = /^\+?[\d\s-]{10,15}$/;
//     if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
//       setStatus({ type: 'error', message: 'Please enter a valid phone number (10-15 digits)' });
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;
    
//     setLoading(true);
//     setStatus({ type: '', message: '' });

//     try {
//       const response = await axios.post(`${apiUrl}/subscribers`, {
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone.replace(/\s/g, '') // Remove spaces
//       });

//       if (response.data.success) {
//         setStatus({ 
//           type: 'success', 
//           message: 'Successfully subscribed! You will receive updates on WhatsApp.' 
//         });
        
//         // Clear form
//         setFormData({ name: '', email: '', phone: '' });
        
//         // Close modal after 3 seconds
//         setTimeout(() => {
//           onClose();
//           setStatus({ type: '', message: '' });
//         }, 3000);
//       }
//     } catch (error) {
//       console.error('Subscription error:', error);
      
//       if (error.response?.data?.message) {
//         setStatus({ type: 'error', message: error.response.data.message });
//       } else if (error.response?.data?.errors) {
//         // Handle validation errors
//         const errors = error.response.data.errors;
//         const errorMessages = Object.values(errors).join(', ');
//         setStatus({ type: 'error', message: errorMessages });
//       } else {
//         setStatus({ type: 'error', message: 'Failed to subscribe. Please try again.' });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       {/* Backdrop */}
//      <div
//   className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
//   onClick={onClose}
// ></div>

//       {/* Modal */}
//       <div className="flex min-h-full items-center justify-center p-4">
//         <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
          
//           {/* Close button */}
//           <button
//             onClick={onClose}
//             className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <X className="w-5 h-5" />
//           </button>

//           {/* Header */}
//           <div className="text-center mb-6">
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">
//               SUBSCRIBE FOR DAILY NEWS!
//             </h2>
//             <p className="text-gray-600">
//               Get the latest news & updates straight to your phone!
//             </p>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Enter Name"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
//                 disabled={loading}
//               />
//             </div>

//             <div>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Enter Email"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
//                 disabled={loading}
//               />
//             </div>

//             <div>
//               <input
//                 type="tel"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 placeholder="Enter Your WhatsApp Number"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
//                 disabled={loading}
//               />
//             </div>

//             {/* Status Message */}
//             {status.message && (
//               <div className={`flex items-center gap-2 p-3 rounded-lg ${
//                 status.type === 'success' 
//                   ? 'bg-green-50 text-green-700' 
//                   : 'bg-red-50 text-red-600'
//               }`}>
//                 {status.type === 'success' 
//                   ? <CheckCircle className="w-5 h-5 flex-shrink-0" />
//                   : <AlertCircle className="w-5 h-5 flex-shrink-0" />
//                 }
//                 <span className="text-md">{status.message}</span>
//               </div>
//             )}

//             {/* Privacy Guarantee */}
//             <div className="text-xs text-center text-gray-500">
//               100% Privacy Guaranteed
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin mr-2" />
//                   Subscribing...
//                 </>
//               ) : (
//                 'Subscribe Now'
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from 'react';
import axios from 'axios';
import { X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function SubscribeModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''  // Sirf name aur phone, kyunki aapke controller me email nahi hai
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear status when user types
    if (status.message) setStatus({ type: '', message: '' });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setStatus({ type: 'error', message: 'Name is required' });
      return false;
    }
    if (!formData.phone.trim()) {
      setStatus({ type: 'error', message: 'WhatsApp number is required' });
      return false;
    }
    // Basic phone validation (10-15 digits, optional +)
    const phoneRegex = /^\+?[\d\s-]{10,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      setStatus({ type: 'error', message: 'Please enter a valid phone number (10-15 digits)' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // Aapke route ke according: POST /api/subscribe
      const response = await axios.post(`${apiUrl}/subscribe`, {
        name: formData.name,
        phone: formData.phone.replace(/\s/g, '') // Remove spaces
      });

      if (response.data.success) {
        setStatus({ 
          type: 'success', 
          message: 'Successfully subscribed! You will receive updates on WhatsApp.' 
        });
        
        // Clear form
        setFormData({ name: '', phone: '' });
        
        // Close modal after 3 seconds
        setTimeout(() => {
          onClose();
          setStatus({ type: '', message: '' });
        }, 3000);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      
      if (error.response?.data?.error) {
        setStatus({ type: 'error', message: error.response.data.error });
      } else {
        setStatus({ type: 'error', message: 'Failed to subscribe. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
   <div
  className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
  onClick={onClose}
></div>
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              SUBSCRIBE FOR DAILY NEWS!
            </h2>
            <p className="text-gray-600">
              Get the latest news & updates straight to your Whatsapp!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                disabled={loading}
              />
            </div>

            <div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter Your WhatsApp Number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                disabled={loading}
              />
            </div>

            {/* Status Message */}
            {status.message && (
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                status.type === 'success' 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-600'
              }`}>
                {status.type === 'success' 
                  ? <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  : <AlertCircle className="w-5 h-5 flex-shrink-0" />
                }
                <span className="text-md">{status.message}</span>
              </div>
            )}

            {/* Privacy Guarantee */}
            <div className="text-xs text-center text-gray-500">
              100% Privacy Guaranteed
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Subscribing...
                </>
              ) : (
                'Subscribe Now'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}