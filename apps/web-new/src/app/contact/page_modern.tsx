"use client";

import { motion } from "framer-motion";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/solid";

export default function ContactPage() {
  const teamMembers = [
    {
      name: "Ashwath",
      role: "Frontend Developer",
      email: "ashwath@example.com",
      phone: "+91-XXXXXXXXXX",
    },
    {
      name: "Team Member 2",
      role: "Backend Developer",
      email: "member2@soulsync.com",
      phone: "+91-XXXXXXXXXX",
    },
  ];

  return (
    <div className="relative flex flex-col items-center min-h-screen w-full bg-gradient-to-b from-blue-100 via-purple-100 to-pink-100 px-4 pb-12 pt-20">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-5xl font-bold text-gray-700 mb-6 mt-8 text-center"
      >
        Contact Us
      </motion.h1>

      <p className="text-gray-700 text-center max-w-3xl mb-10 text-lg">
        Reach out to our team for any questions or support. We are here to help you navigate your mental wellbeing journey.
      </p>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center">
        {teamMembers.map((member, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: idx * 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="flex-1 p-8 bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200 rounded-3xl shadow-2xl cursor-pointer relative overflow-hidden text-center"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 6 }}
              className="absolute -top-10 -right-10 w-32 h-32 bg-purple-300 opacity-30 rounded-full blur-3xl"
            />

            <h3 className="text-2xl font-bold text-gray-800 mb-2">{member.name}</h3>
            <p className="text-gray-700 mb-4">{member.role}</p>

            <div className="flex flex-col gap-2 items-center">
              <div className="flex items-center gap-2 text-gray-800">
                <EnvelopeIcon className="w-5 h-5" />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-800">
                <PhoneIcon className="w-5 h-5" />
                <span>{member.phone}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        animate={{ x: [0, 15, -15, 0], y: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
        className="absolute w-72 h-72 bg-purple-200 opacity-20 rounded-full top-20 left-10 blur-3xl -z-10"
      />
      <motion.div
        animate={{ x: [0, -15, 15, 0], y: [0, -10, 10, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
        className="absolute w-96 h-96 bg-green-200 opacity-20 rounded-full bottom-10 right-10 blur-3xl -z-10"
      />
    </div>
  );
}
