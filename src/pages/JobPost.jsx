import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../Context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import Select from 'react-select';

export default function JobPost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState({ value: 'Cleaning', label: 'Cleaning' });
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const options = [
    { value: 'Cleaning', label: 'Cleaning' },
    { value: 'Moving Help', label: 'Moving Help' },
    { value: 'Yard Work', label: 'Yard Work' },
    { value: 'Handyman', label: 'Handyman' },
    { value: 'Delivery', label: 'Delivery' },
    { value: 'Waiter', label: 'Waiter' },
    { value: 'Other', label: 'Other' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!title || !description || !location || !price) {
        throw new Error('Please fill all fields');
      }

      const { error: postError } = await supabase.from('jobs').insert([
        {
          title,
          description,
          category: category.value,
          location,
          price: parseFloat(price),
          user_id: user?.id,
          posted_by: user?.email,
        },
      ]);

      if (postError) throw postError;

      setSuccess('Job posted successfully!');
      setTitle('');
      setDescription('');
      setLocation('');
      setPrice('');
      setCategory({ value: 'Cleaning', label: 'Cleaning' });

      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-200">
      <Navbar />

      <main className="flex-grow pt-12 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-10 text-gray-800 text-center">
            Post a New Job / Gig
          </h1>

          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8 transition duration-300">
            {error && (
              <div className="mb-6 flex items-center gap-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md animate-pulse">
                <AlertTriangle className="w-5 h-5" />
                <p className="text-sm font-semibold">{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-6 flex items-center gap-2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md animate-fade-in">
                <CheckCircle className="w-5 h-5" />
                <p className="text-sm font-semibold">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Job Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                    placeholder="e.g., House Cleaning, Moving Help"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <Select
                    value={category}
                    onChange={(selected) => setCategory(selected)}
                    options={options}
                    styles={{
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected
                          ? '#e5e7eb' 
                          : state.isFocused
                          ? '#f3f4f6' 
                          : 'white',
                        color: 'black',
                      }),
                      control: (provided) => ({
                        ...provided,
                        borderRadius: '0.375rem',
                        borderColor: '#d1d5db', 
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor: '#9ca3af', 
                        },
                      }),
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:ring-2 focus:ring-gray-400 transition"
                    placeholder="e.g., Downtown, NW 23rd Ave"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Hourly Rate ($)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:ring-2 focus:ring-gray-400 transition"
                    placeholder="e.g., 15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Job Description</label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:ring-2 focus:ring-gray-400 transition"
                  placeholder="Provide details about the job, requirements, etc."
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-5 py-2 rounded-md bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 rounded-md bg-gray-800 text-white font-semibold hover:bg-gray-900 transition duration-200 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Posting...' : 'Post Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
