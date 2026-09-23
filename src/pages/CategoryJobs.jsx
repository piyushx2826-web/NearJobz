import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JobCard from '../components/JobCard';
import { motion } from 'framer-motion';

export default function CategoryJobs() {
  const { categoryName } = useParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryJobs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('category', categoryName)
        .order('created_at', { ascending: false });

      if (!error) {
        setJobs(data);
      } else {
        console.error('Error fetching category jobs:', error);
      }

      setLoading(false);
    };

    fetchCategoryJobs();
  }, [categoryName]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-800">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-10">
        <motion.h1
          className="text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {categoryName} Jobs
        </motion.h1>

        {loading ? (
          <p className="text-gray-500">Loading jobs...</p>
        ) : jobs.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4 }}
              >
                <JobCard job={job} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-gray-600">No jobs found in this category.</p>
        )}

        <div className="mt-8">
          <Link
            to="/"
            className="inline-block px-4 py-2 border border-gray-700 text-gray-700 rounded hover:bg-gray-700 hover:text-white transition"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
