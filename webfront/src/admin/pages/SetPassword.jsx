import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function SetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_URL;
  
  // Get email from location state or localStorage
  const email = location.state?.email || localStorage.getItem('pending_email') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validations
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/auth/set-password`, {
        email,
        newPassword,
        confirmPassword
      });

      if (response.data.success) {
        setSuccess('Password set successfully! Redirecting to login...');
        
        // Clear stored email
        localStorage.removeItem('pending_email');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login', { 
            state: { message: 'Password set successfully. Please login.' }
          });
        }, 2000);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error setting password:', error);
      setError(error.response?.data?.message || 'Failed to set password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    
    return {
      level: strength,
      color: strength <= 2 ? 'red' : strength <= 3 ? 'yellow' : 'green',
      text: strength <= 2 ? 'Weak' : strength <= 3 ? 'Medium' : 'Strong'
    };
  };

  const strength = passwordStrength(newPassword);

  return (
    <div className="min-h-screen flex flex-col md:flex-row px-4 py-4">
      {/* Left Side - Image */}
      <div
        className="hidden md:flex md:w-2/5 bg-cover bg-center text-white flex-col justify-between rounded-[20px] p-10"
        style={{ backgroundImage: "url('/login.png')" }}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="rounded-full p-2 mt-4 w-60">
            <img
              src="/adminlogo.svg"
              alt="Logo"
              className="h-10 w-50"
              draggable={false}
            />
          </div>
          <div className="mb-6">
            <p className="text-white text-4xl">
              Secure Your Account
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-3/5 flex items-center justify-center bg-gray-50">
        <form onSubmit={handleSubmit} className="w-full max-w-lg p-8">
          <h1 className="text-3xl mb-1">
            Set Your Password
          </h1>
          
          <p className="text-md text-gray-500 mb-6">
            Create a strong password for your account
            {email && <span className="block mt-1">for <strong>{email}</strong></span>}
          </p>

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-md">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-md">
              {error}
            </div>
          )}

          {/* New Password */}
          <label className="block text-md mb-1 text-gray-700">
            New Password *
          </label>
          <div className="relative mb-2">
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {newPassword && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Password strength:</span>
                <span className={`text-xs font-medium ${
                  strength.color === 'green' ? 'text-green-600' :
                  strength.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {strength.text}
                </span>
              </div>
              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    strength.color === 'green' ? 'bg-green-500' :
                    strength.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(strength.level / 5) * 100}%` }}
                ></div>
              </div>
              <ul className="text-xs text-gray-500 mt-2 space-y-1">
                <li className={newPassword.length >= 6 ? 'text-green-600' : ''}>
                  ✓ At least 6 characters
                </li>
                <li className={/[a-z]/.test(newPassword) ? 'text-green-600' : ''}>
                  ✓ At least one lowercase letter
                </li>
                <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>
                  ✓ At least one uppercase letter
                </li>
                <li className={/\d/.test(newPassword) ? 'text-green-600' : ''}>
                  ✓ At least one number
                </li>
                <li className={/[@$!%*?&]/.test(newPassword) ? 'text-green-600' : ''}>
                  ✓ At least one special character (@$!%*?&)
                </li>
              </ul>
            </div>
          )}

          {/* Confirm Password */}
          <label className="block text-md mb-1 text-gray-700">
            Confirm Password *
          </label>
          <div className="relative mb-6">
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Password Match Indicator */}
          {confirmPassword && (
            <div className={`mb-4 p-2 rounded text-md ${
              newPassword === confirmPassword 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {newPassword === confirmPassword 
                ? '✓ Passwords match' 
                : '✗ Passwords do not match'}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !newPassword || !confirmPassword}
            className="w-full bg-black text-white rounded-lg py-3 font-medium hover:opacity-90 disabled:opacity-60 transition duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Setting Password...
              </span>
            ) : "Set Password"}
          </button>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-500 hover:text-blue-700 font-medium"
              >
                Login here
              </button>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              By setting your password, you agree to our{" "}
              <a href="/terms" className="text-blue-500 hover:underline">Terms</a>{" "}
              and{" "}
              <a href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}