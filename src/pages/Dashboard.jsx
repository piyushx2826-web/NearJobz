import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JobCard from '../components/JobCard';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 🔐 Get user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error('User not logged in');

        // 📌 Fetch Jobs
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (jobsError) throw jobsError;
        setJobs(jobsData || []);

        // 📌 Fetch Applications
        if (jobsData.length > 0) {
          const jobIds = jobsData.map((job) => job.id);

          const { data: appsData, error: appsError } = await supabase
            .from('applications')
            .select('*')
            .in('jobs_id', jobIds)
            .order('created_at', { ascending: false });

          if (appsError) throw appsError;
          setApplications(appsData || []);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <Navbar />

      <main className="flex-grow py-10 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-10">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-extrabold text-gray-800"
            >
              Your Dashboard
            </motion.h1>

            <Link
              to="/post-job"
              className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-full shadow-lg"
            >
              + Post Job
            </Link>
          </div>

          {/* ERROR */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* JOBS */}
          <section className="mb-14">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              Your Posted Jobs
            </h2>

            {loading ? (
              <p>Loading...</p>
            ) : jobs.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} editable />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </section>

          {/* APPLICATIONS */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              Applications Received
            </h2>

            {applications.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-600">No applications yet.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {applications.map((app, index) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition flex justify-between items-center"
                  >

                    {/* LEFT */}
                    <div className="flex items-center gap-4">

                      {app.photo ? (
                        <img
                          src={`https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/profile-photos/${app.photo}`}
                          alt={`${app.first_name} ${app.last_name}`}
                          className="w-14 h-14 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center font-bold">
                          {app.first_name?.[0]}{app.last_name?.[0]}
                        </div>
                      )}

                      <div>
                        <h3 className="font-semibold text-lg">
                          {app.first_name} {app.last_name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {app.experience || 0} yrs • {app.skills || 'No skills'}
                        </p>
                      </div>

                    </div>

                    {/* RIGHT */}
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="bg-gray-800 hover:bg-black text-white px-4 py-1 rounded-lg"
                    >
                      View
                    </button>

                  </motion.div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>

      {/* MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white p-6 rounded-xl max-w-md w-full relative shadow-xl"
          >

            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-2 right-3 text-gray-500"
            >
              ✕
            </button>

            {/* PROFILE */}
            <div className="flex flex-col items-center mb-4">

              {selectedApp.photo ? (
                <img
                  src={`https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/profile-photos/${selectedApp.photo}`}
                  alt={`${selectedApp.first_name} ${selectedApp.last_name}`}
                  className="w-24 h-24 rounded-full object-cover border-2"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold">
                  {selectedApp.first_name?.[0]}{selectedApp.last_name?.[0]}
                </div>
              )}

              <h2 className="text-xl font-bold mt-3">
                {selectedApp.first_name} {selectedApp.last_name}
              </h2>

              <p className="text-gray-500 text-sm">
                {selectedApp.experience || 0} yrs • {selectedApp.skills || 'No skills'}
              </p>
            </div>

            {/* DETAILS */}
            <div className="text-sm space-y-2">
              <p><b>Email:</b> {selectedApp.email}</p>
              <p><b>Phone:</b> {selectedApp.phone}</p>

              <p className="mt-2">
                <b>Cover Letter:</b><br />
                {selectedApp.cover_letter}
              </p>
            </div>

          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-gray-50 border rounded-lg p-8 text-center">
      <p className="text-gray-600 mb-4">
        You haven't posted any jobs yet.
      </p>
      <Link
        to="/post-job"
        className="bg-gray-700 text-white px-5 py-2 rounded-md"
      >
        Post Your First Job
      </Link>
    </div>
  );
}