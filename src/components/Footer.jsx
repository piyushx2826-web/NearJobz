import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { motion } from 'framer-motion';



export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-gray-200 pt-12 pb-6"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        
          <div>
            <h3 className="text-3xl font-bold mb-4 text-white">NearJobz</h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Connecting local businesses with talented, on-demand workers right in your neighborhood.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-transform transform hover:scale-110"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-transform transform hover:scale-110"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-transform transform hover:scale-110"
              >
                <FaLinkedinIn size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4 text-gray-200">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="hover:text-white transition duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/browse-jobs" className="hover:text-white transition duration-200">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/post-job" className="hover:text-white transition duration-200">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition duration-200">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

         
          <div>
            <h4 className="text-xl font-semibold mb-4 text-gray-200">Contact Us</h4>
            <p className="text-gray-400 mb-2">
              Email:{' '}
              <a href="mailto:winterDhiman456@gmail.com" className="text-gray-200 hover:underline">
                winterDhiman456@gmail.com
              </a>
            </p>
            <p className="text-gray-400">
              Phone:{' '}
              <span className="text-gray-200 hover:underline">8974561225</span>
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()}{' '}
            <span className="text-gray-300 font-semibold">NearJobz</span>. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
