import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JobCard from '../components/JobCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../services/supabase';
import { useAuth } from '../Context/AuthContext';
import { motion } from 'framer-motion';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [showMoreCategories, setShowMoreCategories] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);
      if (!error) setJobs(data);
      setLoading(false);
    };

    fetchJobs();
  }, []);

  const toggleCategories = () => setShowMoreCategories(!showMoreCategories);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-800">
      <Navbar />

      <main className="flex-grow">
     
        <section className="relative overflow-hidden text-gray-900 py-20 bg-gradient-to-r from-gray-200 to-gray-300">
          <div className="container mx-auto text-center px-6 z-10 relative">
            <motion.h1
              className="text-5xl font-extrabold mb-4 leading-tight drop-shadow"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Discover Local Jobs & Gigs
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl mb-8 max-w-3xl mx-auto drop-shadow"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Browse and apply to trusted short-term tasks near you.
            </motion.p>

            <motion.div
              className="flex justify-center gap-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {user ? (
                <Link
                  to="/post-job"
                  className="bg-gray-800 text-white hover:bg-gray-900 px-8 py-3 rounded-lg font-semibold text-lg shadow-md"
                >
                  Post a Job
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="bg-gray-800 text-white hover:bg-gray-900 px-8 py-3 rounded-lg font-semibold text-lg shadow-md"
                  >
                    Join Now
                  </Link>
                  <Link
                    to="/login"
                    className="bg-transparent border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg"
                  >
                    Login
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
              Top Categories
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              <CategoryCard title="Cleaning" icon="🧹" count={23} color="bg-gray-100" />
              <CategoryCard title="Moving Help" icon="📦" count={15} color="bg-gray-200" />
              <CategoryCard title="Yard Work" icon="🌱" count={18} color="bg-gray-100" />
              <CategoryCard title="Handyman" icon="🛠️" count={12} color="bg-gray-200" />
            </div>
            {showMoreCategories && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6">
                <CategoryCard title="Tutoring" icon="📚" count={10} color="bg-gray-100" />
                <CategoryCard title="Pet Sitting" icon="🐾" count={8} color="bg-gray-200" />
                <CategoryCard title="Delivery" icon="🚚" count={5} color="bg-gray-100" />
                <CategoryCard title="Gardening" icon="🌼" count={7} color="bg-gray-200" />
              </div>
            )}
            <div className="flex justify-center mt-6">
              <button
                onClick={toggleCategories}
                className="text-gray-800 hover:underline text-sm font-medium"
              >
                {showMoreCategories ? 'Hide Categories' : 'Show More Categories'}
              </button>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Recent Job Listings
              </h2>
              <Link to="/jobs" className="text-gray-700 font-medium hover:underline">
                View All →
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                {jobs.map((job) => (
                  <motion.div
                    key={job.id}
                    variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.5 }}
                  >
                    <JobCard job={job} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function CategoryCard({ title, icon, count, color }) {
  return (
    <Link to={`/category/${encodeURIComponent(title)}`}>
      <motion.div
        className="bg-white rounded-xl shadow hover:shadow-xl transition-all duration-200 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className={`${color} h-24 flex items-center justify-center text-4xl rounded-t-xl`}>
          {icon}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600">{count} jobs available</p>
        </div>
      </motion.div>
    </Link>
  );
}

function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="flex justify-between mt-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
}
