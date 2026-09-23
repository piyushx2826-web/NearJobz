import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-10 border border-gray-200"
        >
          <h1 className="text-4xl font-extrabold text-center mb-2 text-gray-800">
            Terms & Conditions
          </h1>
          <p className="text-sm text-gray-500 mb-10 text-center">
            Last updated: June 2025
          </p>

          {[
            {
              title: '1. Introduction',
              content: `Welcome to LocalGigsConnect ("we," "our," or "us"). These Terms and Conditions govern your access to and use of our platform.`,
              more: `By accessing or using our services, you agree to be bound by these Terms. If you do not agree, do not use our platform.`,
            },
            {
              title: '2. User Accounts',
              content: `You must be at least 18 years old to create an account. You are responsible for maintaining confidentiality and accuracy.`,
              list: [
                'At least 18 years old to register',
                'Keep login credentials safe',
                'Provide accurate information',
                'We may suspend accounts violating policies',
              ],
            },
            {
              title: '3. Job Listings',
              content: `Employers and Workers agree to follow professional conduct, legal obligations, and clearly defined expectations.`,
              more: `LocalGigsConnect does not guarantee quality, safety, or legality of posted jobs.`,
            },
            {
              title: '4. Payments',
              content: `Payments are managed directly between employers and workers. We may offer optional payment processing features.`,
              more: `Disputes must be handled between parties; mediation may be offered.`,
            },
            {
              title: '5. Conduct & Content',
              content: `Do not post illegal, fraudulent, or abusive content. Respect all users and laws.`,
              more: `We reserve the right to remove any content without notice.`,
            },
            {
              title: '6. Limitation of Liability',
              content: `We are not liable for any damages or interruptions in service. Access may be affected by factors beyond our control.`,
            },
            {
              title: '7. Changes to Terms',
              content: `We may modify these Terms at any time. Continued use means you accept the updated Terms.`,
            },
            {
              title: '8. Contact Us',
              content: `Have questions? Reach out to us:`,
              more: (
                <>
                  <p>
                    Email:{' '}
                    <Link
                      to="mailto:legal@localgigsconnect.com"
                      className="text-gray-700 underline"
                    >
                      legal@localgigsconnect.com
                    </Link>
                  </p>
                  <p>Address: Himachal Pradesh ,Kangra , 176001</p>
                </>
              ),
            },
          ].map((section, i) => (
            <motion.section
              key={i}
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="mb-10"
            >
              <h2 className="text-xl font-bold mb-3 text-gray-800 border-l-4 border-gray-400 pl-3">
                {section.title}
              </h2>
              <p className="text-gray-700 mb-3">{section.content}</p>
              {section.list && (
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  {section.list.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
              {section.more && (
                <div className="text-gray-700 mt-2">{section.more}</div>
              )}
            </motion.section>
          ))}

          <div className="mt-10 pt-6 border-t border-gray-200">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-gray-500 text-center"
            >
              By using LocalGigsConnect, you acknowledge that you have read,
              understood, and agree to these Terms.
            </motion.p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;
