import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../Context/AuthContext";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { user } = useAuth();
  const [appliedCount, setAppliedCount] = useState(0);
  const [postedCount, setPostedCount] = useState(0);
  const [loading, setLoading] = useState(true);
//test change
  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      if (user) {
        const { count: applicationsCount, error: appError } = await supabase
          .from("applications")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);
        if (!appError) setAppliedCount(applicationsCount);

        const { count: jobsCount, error: jobsError } = await supabase
          .from("jobs")
          .select("*", { count: "exact", head: true })
          .eq("posted_by", user.id);
        if (!jobsError) setPostedCount(jobsCount);
      }
      setLoading(false);
    };

    fetchCounts();
  }, [user]);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300">
      <Navbar />

      <motion.div
        className="max-w-4xl mx-auto mt-12 px-6 py-10 rounded-3xl shadow-2xl backdrop-blur-lg bg-white/60 border border-gray-200"
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex flex-col md:flex-row items-center md:items-start mb-10 gap-6">
          <motion.img
            src={user?.user_metadata?.avatar_url || "/default-avatar.png"}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-gray-300 shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h1 className="text-3xl font-bold text-gray-800">
              {user?.user_metadata?.full_name || "User Name"}
            </h1>
            <p className="text-gray-600 text-sm mt-1">{user?.email}</p>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.2 },
            },
          }}
        >
          <motion.div
            className="bg-gradient-to-r from-slate-100 to-slate-200 p-6 rounded-xl shadow text-center hover:scale-105 transition-transform"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Jobs Applied
            </h2>
            <p className="text-4xl font-bold text-gray-900">{appliedCount}</p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-slate-100 to-slate-200 p-6 rounded-xl shadow text-center hover:scale-105 transition-transform"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Jobs Posted
            </h2>
            <p className="text-4xl font-bold text-gray-900">{postedCount}</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            About Me
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {user?.user_metadata?.bio || "This user has not provided a bio."}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Other Details
          </h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>
              Account created at:{" "}
              {new Date(user.created_at).toLocaleDateString()}
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}
