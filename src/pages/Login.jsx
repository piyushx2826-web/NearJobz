import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { supabase } from '../supabaseClient';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="backdrop-blur-xl bg-white/70 border border-gray-300 shadow-2xl p-8 rounded-2xl max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6 drop-shadow-md">Welcome Back</h2>

        {error && (
          <div className="mb-4 bg-red-100 text-red-800 border border-red-400 rounded p-2 text-sm shadow">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />

          <div className="flex justify-between text-sm text-gray-700">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="form-checkbox text-gray-600" />
              Remember me
            </label>
            <Link to="/forgot-password" className="hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 rounded-lg shadow-lg transition duration-300"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <hr className="flex-grow border-gray-400" />
          <span className="text-gray-600 text-sm">Or continue with</span>
          <hr className="flex-grow border-gray-400" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleOAuthLogin('google')}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg bg-white text-gray-700 hover:bg-gray-100 shadow"
          >
            <FcGoogle size={20} />
            Google
          </button>
          <button
            onClick={() => handleOAuthLogin('facebook')}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg bg-white text-gray-700 hover:bg-gray-100 shadow"
          >
            <FaFacebook size={20} className="text-blue-600" />
            Facebook
          </button>
        </div>

        <p className="mt-6 text-center text-gray-700 text-sm">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-gray-900 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
