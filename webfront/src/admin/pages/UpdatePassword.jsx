import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  async function submit(e) {
    e.preventDefault();
    setErr('');

    if (password !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const email = localStorage.getItem("resetEmail");

      await axios.post(`${apiUrl}/auth/update-password`, {
        email,
        newPassword: password,
      });
      localStorage.removeItem("resetEmail");

      navigate("/admin");
    } catch (e) {
      setErr(e.response?.data?.message || "Password update failed");
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
          <h1 className="text-3xl mb-1">Password Updated Securely</h1>
          <p className="text-sm text-gray-500 mb-6">
            Choose a strong password to secure your InvestBay account
          </p>

          {err && <p className="text-red-500 mb-3">{err}</p>}

          <label className="block text-sm mb-1">Password</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />

          <label className="block text-sm mb-1">Confirm Password</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-lg py-2 font-medium disabled:opacity-60"
          >
            {loading ? 'Submitting....' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}
