import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);

    try {
      await axios.post(`${apiUrl}/auth/forgot-password`, {
        email,
      });
      localStorage.setItem('resetEmail', email);
      navigate('/admin/verify-password');
    } catch (e) {
      setErr(e.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row px-4 py-4">
      <div
        className="hidden md:flex md:w-2/5 bg-cover bg-center text-white flex-col justify-between rounded-[20px] p-10"
        style={{ backgroundImage: "url('/login.png')" }}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="rounded-full p-2 mt-4 w-60">
            <img src="/adminlogo.svg" alt="Logo" className="h-10 w-50" />
          </div>
          <div className="mb-6">
            <p className="text-white text-4xl">
              Next-Gen Investing for the Modern Trader.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full md:w-3/5 flex items-center justify-center bg-gray-50">
        <form onSubmit={submit} className="w-full max-w-lg p-8">
          <h1 className="text-3xl mb-1">Forgot Password ?</h1>
          <p className="text-sm text-gray-500 mb-6">
            Enter your registered email and we'll send you a verification code.
          </p>

          {err && <p className="text-red-500 mb-2">{err}</p>}

          <label className="block text-sm mb-1">Email</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter email"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-lg py-2 font-medium hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Getting....' : 'Get Code'}
          </button>
        </form>
      </div>
    </div>
  );
}
