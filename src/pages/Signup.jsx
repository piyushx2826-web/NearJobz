import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

export default function Signup() {
  const [fullName, ] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  const sendOTP = async () => {
    try {
      setError('');
      setLoading(true);

      const { error } = await supabase.auth.signInWithOtp({
        phone: phone,
      });

      if (error) throw error;

      setOtpSent(true); 
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpSent) {
      setError('Please request OTP first');
      return;
    }

    try {
      setError('');
      setLoading(true);

     
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;

      const user = data.user;

    
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: user.id,
          email: email,
          username: username.trim(),
          full_name: fullName,
          phone: phone,
          terms_accepted: true,
        },
      ]);

      if (profileError) throw profileError;

     
      navigate('/');

    } catch (err) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  
  const handleOAuthLogin = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-teal-50 to-gray-200 px-4">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          
          {/* <div>
            <label className="block text-sm text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              required
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div> */}

          <div>
            <label className="block text-sm text-gray-600 mb-1">Username</label>
            <input
              type="text"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

         
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="+91XXXXXXXXXX"
                value={phone}
                required
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
              <button
                type="button"
                onClick={sendOTP}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                OTP
              </button>
            </div>
          </div>

         
          {otpSent && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">Enter OTP</label>
              <input
                type="text"
                value={otp}
                required
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          )}

       
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" required />
            <span>
              Accept <span className="text-teal-600">Terms</span> &{" "}
              <span className="text-teal-600">Privacy Policy</span>
            </span>
          </div>

         
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700"
          >
            {loading ? 'Processing...' : 'Sign Up'}
          </button>
        </form>

       
        <div className="flex items-center my-5">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 text-gray-400 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* OAuth */}
        <div className="flex gap-3">
          <button
            onClick={() => handleOAuthLogin('google')}
            className="flex-1 flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50"
          >
            <FcGoogle /> Google
          </button>

          <button
            onClick={() => handleOAuthLogin('facebook')}
            className="flex-1 flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50"
          >
            <FaFacebook className="text-blue-600" /> Facebook
          </button>
        </div>

        
        <p className="text-center text-sm text-gray-600 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-600 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}