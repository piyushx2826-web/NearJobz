import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';

const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setMessage('✅ Password updated successfully! You can now log in.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-xl p-8 w-full max-w-md border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Update Password
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          Set a new secure password for your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium text-gray-700">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none transition text-sm bg-white"
              placeholder="Enter your new password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-lg transition"
          >
            Update Password
          </button>
        </form>

        {message && (
          <div className="mt-4 text-sm text-green-700 bg-green-100 p-2 rounded text-center">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-4 text-sm text-red-700 bg-red-100 p-2 rounded text-center">
            {error}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UpdatePassword;
