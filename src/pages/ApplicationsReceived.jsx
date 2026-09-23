import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

export default function ApplyNow() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    cover_letter: '',
    photo: null,
  });

  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // 🎯 Handle Input
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'photo') {
      const file = files[0];
      setFormData((prev) => ({ ...prev, photo: file }));

      if (file) {
        setPreview(URL.createObjectURL(file)); // ✅ preview fix
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // 🚀 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let photoUrl = null;

      // ✅ Upload photo to Supabase
      if (formData.photo) {
        const fileExt = formData.photo.name.split('.').pop();
        const fileName = `public/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(fileName, formData.photo);

        if (uploadError) throw uploadError;

        // ✅ Get public URL
        const { data } = supabase.storage
          .from('profile-photos')
          .getPublicUrl(fileName);

        photoUrl = data.publicUrl;
      }

      // ✅ Insert into database
      const { error } = await supabase.from('applications').insert([
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          cover_letter: formData.cover_letter,
          photo: photoUrl,
        },
      ]);

      if (error) throw error;

      setMessage('✅ Application submitted successfully!');

      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        cover_letter: '',
        photo: null,
      });
      setPreview(null);

    } catch (err) {
      console.error(err);
      setMessage('❌ Error submitting application');
    }

    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 px-4 py-12 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-3xl font-bold text-center mb-4">Apply for Job</h2>

          {message && (
            <div className="text-center mb-4 p-2 bg-gray-100 rounded">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NAME */}
            <div className="grid grid-cols-2 gap-4">
              <input
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="First Name"
                required
                className="border px-3 py-2 rounded-lg w-full"
              />
              <input
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Last Name"
                required
                className="border px-3 py-2 rounded-lg w-full"
              />
            </div>

            {/* EMAIL */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="border px-3 py-2 rounded-lg w-full"
            />

            {/* PHONE */}
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              required
              className="border px-3 py-2 rounded-lg w-full"
            />

            {/* PHOTO UPLOAD */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {preview ? (
                  <img
                    src={preview}   // ✅ FIXED HERE
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>

              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            {/* COVER LETTER */}
            <textarea
              name="cover_letter"
              value={formData.cover_letter}
              onChange={handleChange}
              placeholder="Why should we hire you?"
              required
              className="border px-3 py-2 rounded-lg w-full h-28"
            />

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-black"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>

          </form>
        </motion.div>
      </div>

      <Footer />
    </>
  );
}