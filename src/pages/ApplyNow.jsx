import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { MdWorkOutline } from 'react-icons/md';

export default function ApplyNow() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const messageRef = useRef(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    cover_letter: '',
    experience: '',
    skills: '',
    photo: null,
  });

  const [preview, setPreview] = useState(null);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  // 🔐 Auth check
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) navigate('/login');
    };
    checkSession();
  }, [navigate]);

  // 🎯 Handle input
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'photo') {
      const file = files[0];
      setFormData((prev) => ({ ...prev, photo: file }));

      if (file) setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ⭐ Auto Rating
  useEffect(() => {
    const exp = Number(formData.experience);

    if (exp >= 5) setRating(5);
    else if (exp >= 3) setRating(4);
    else if (exp >= 2) setRating(3);
    else if (exp >= 1) setRating(2);
    else if (exp > 0) setRating(1);
    else setRating(0);
  }, [formData.experience]);

  // ✅ Validation
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(formData.email.trim())) {
      setMessage('Invalid email');
      setMessageType('error');
      return false;
    }

    if (!phoneRegex.test(formData.phone.trim())) {
      setMessage('Invalid phone number');
      setMessageType('error');
      return false;
    }

    return true;
  };

  // 🚀 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('User not logged in');

      let photoUrl = null;

      if (formData.photo) {
        const fileExt = formData.photo.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(fileName, formData.photo);

        if (uploadError) throw uploadError;

        photoUrl = fileName;
      }

      const formattedSkills = formData.skills
        .split(',')
        .map((s) => s.trim())
        .join(', ');

      const { error } = await supabase.from('applications').insert([
        {
          ...formData,
          experience: Number(formData.experience) || 0,
          skills: formattedSkills,
          rating,
          photo: photoUrl,
          status: 'pending',
          jobs_id: Number(jobId),
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      setMessage('🎉 Application submitted successfully!');
      setMessageType('success');

      setTimeout(() => navigate('/'), 2000);

    } catch (err) {
      setMessage(err.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 px-4">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl"
        >

          {/* HEADER */}
          <div className="text-center mb-8">
            <MdWorkOutline className="text-4xl mx-auto text-gray-600" />
            <h2 className="text-2xl font-bold mt-2">Apply for Job</h2>
            <p className="text-gray-500 text-sm">Fill your details carefully</p>
          </div>

          {/* MESSAGE */}
          {message && (
            <div
              ref={messageRef}
              className={`mb-6 p-3 text-center rounded-lg ${
                messageType === 'success'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* NAME */}
            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="first_name"
                placeholder="First Name"
                required
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-300 outline-none"
              />
              <input
                name="last_name"
                placeholder="Last Name"
                required
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-300 outline-none"
              />
            </div>

            {/* CONTACT */}
            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="email"
                placeholder="Email"
                required
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-300 outline-none"
              />
              <input
                name="phone"
                placeholder="Phone"
                required
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-300 outline-none"
              />
            </div>

            {/* PHOTO */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-xl">👤</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Upload Photo</label>
                <input type="file" name="photo" accept="image/*" onChange={handleChange} />
              </div>
            </div>

            {/* EXPERIENCE + SKILLS */}
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="number"
                name="experience"
                placeholder="Experience (years)"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-300 outline-none"
              />
              <input
                name="skills"
                placeholder="Skills (comma separated)"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-300 outline-none"
              />
            </div>

            {/* RATING */}
            <div>
              <p className="text-sm font-medium">Rating</p>
              <div className="text-yellow-500 text-lg">
                {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
              </div>
            </div>

            {/* COVER LETTER */}
            <textarea
              name="cover_letter"
              placeholder="Why should we hire you?"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg h-28 focus:ring-2 focus:ring-gray-300 outline-none"
            />

            {/* BUTTON */}
            <button
              disabled={loading}
              className="w-full bg-gray-800 hover:bg-black text-white py-3 rounded-lg font-semibold transition"
            >
              {loading ? 'Submitting...' : 'Apply Now'}
            </button>

          </form>
        </motion.div>
      </div>

      <Footer />
    </>
  );
}