"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center min-h-screen py-24 px-6 bg-gradient-to-b from-blue-100 via-purple-100 to-pink-100">
      
      {/* Logo */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="mb-6"
      >
        <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full flex items-center justify-center">
          <span className="text-white text-4xl font-bold">SS</span>
        </div>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="text-4xl md:text-5xl font-bold text-blue-600 mb-8 text-center"
      >
        About SoulSync
      </motion.h1>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="max-w-4xl"
      >
        <p className="text-gray-700 text-center text-lg md:text-xl mb-8">
          <strong>SoulSync bridges the gap</strong> between students and mental wellbeing resources by offering 
          <strong> AI-guided support, psychoeducational materials, peer forums, and confidential counselling</strong>, 
          all in one immersive platform. Our goal is to make mental health support <strong>accessible, stigma-free, and culturally aware</strong> for students.
        </p>

        {/* Optional extra content */}
        <p className="text-gray-700 text-center text-md md:text-lg">
          Explore features such as <strong>personalized AI-guided first-aid support</strong>, 
          <strong> confidential counsellor appointments</strong>, a <strong>resource hub with mental wellness guides</strong>, 
          and <strong>peer-to-peer support forums</strong>. SoulSync is designed to help students navigate <strong>stress, anxiety, and other challenges</strong> in a safe digital environment.
        </p>
      </motion.div>

      {/* Floating Background Blobs */}
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
