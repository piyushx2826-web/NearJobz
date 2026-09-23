import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('❌ Passwords do not match.');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setMessage('✅ Password updated successfully! You can now log in.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-xl shadow-xl rounded-xl p-8 w-full max-w-md border border-gray-200"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          🔐 Reset Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              New Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition text-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-lg transition duration-300"
          >
            Reset Password
          </button>
        </form>

        {message && (
          <div className="mt-4 bg-green-100 text-green-800 text-sm p-2 rounded text-center">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-4 bg-red-100 text-red-800 text-sm p-2 rounded text-center">
            {error}
          </div>
        )}
      </motion.div>
    </div>
  );
}
