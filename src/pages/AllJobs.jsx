import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { Briefcase, MapPin } from "lucide-react";
import Navbar from "../components/Navbar";
import { supabase } from "../services/supabase";

const Badge = ({ children }) => (
  <span className="inline-block rounded-full bg-gray-200 px-3 py-0.5 text-xs font-semibold text-gray-800">
    {children}
  </span>
);

const PrimaryButton = ({ children }) => (
  <button className="bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition duration-300">
    {children}
  </button>
);

const JobCard = ({ job }) => (
  <motion.article
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-md hover:shadow-xl transition"
  >
    <header className="flex justify-between items-start">
      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        <Briefcase size={18} /> {job.title}
      </h3>
      <Badge>{job.category}</Badge>
    </header>

    <p className="flex items-center gap-2 text-sm text-gray-600 mt-1">
      <MapPin size={16} /> {job.location}
    </p>

    {/* FIXED: using description from DB */}
    <p className="text-sm text-gray-700 mt-2">
      {job.description}
    </p>

    <div className="mt-4 flex items-center justify-between">
      <span className="text-base font-bold text-gray-800">
        {job.rate || "N/A"}
      </span>

      <Link to={`/${job.id}`}>
        <PrimaryButton>Apply Now</PrimaryButton>
      </Link>
    </div>
  </motion.article>
);

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("id", { ascending: false });

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (!error) {
      setJobs(data);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 py-12">
      <Navbar />

      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800">
            🚀 Explore All Jobs
          </h1>
          <p className="mt-2 text-gray-600">
            Find your next opportunity today!
          </p>
        </div>

        <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.length > 0 ? (
            jobs.map((job) => <JobCard key={job.id} job={job} />)
          ) : (
            <p className="col-span-3 text-center text-gray-500">
              No jobs found
            </p>
          )}
        </section>
      </div>

      <Footer />
    </main>
  );
};

export default AllJobs;