'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ChatBubbleLeftIcon, 
  UserIcon, 
  ChartBarIcon, 
  PlusIcon,
  ClipboardDocumentCheckIcon,
  BookOpenIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  // Extract domain and determine institution
  const emailDomain = session.user.email?.split('@')[1];
  let institution = 'Individual';
  let institutionType = 'personal';

  const domainMap: { [key: string]: string } = {
    'sairamtap.edu.in': 'Sairam Engineering College',
    'iitm.ac.in': 'IIT Madras',
    'anna.edu.in': 'Anna University',
    'vit.edu.in': 'VIT University',
  };

  if (emailDomain && domainMap[emailDomain]) {
    institution = domainMap[emailDomain];
    institutionType = 'educational';
  }

  const generateAnonymousName = (email: string) => {
    const adjectives = ['Peaceful', 'Calm', 'Serene', 'Mindful', 'Zen', 'Bright', 'Wise', 'Kind'];
    const nouns = ['Spirit', 'Soul', 'Mind', 'Heart', 'Star', 'Light', 'Wave', 'Leaf'];
    
    const hash = email.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const adjIndex = Math.abs(hash) % adjectives.length;
    const nounIndex = Math.abs(Math.floor(hash / 10)) % nouns.length;
    const number = Math.abs(hash % 1000);
    
    return `${adjectives[adjIndex]}${nouns[nounIndex]}${number}`;
  };

  const anonymousName = session.user.email ? generateAnonymousName(session.user.email) : 'AnonymousUser';

  return (
    <div className="max-w-6xl mx-auto px-4 relative min-h-screen">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-100 via-purple-100 to-pink-100 -z-10 rounded-2xl"></div>
      
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl p-8 mb-8 shadow-2xl relative overflow-hidden"
      >
        {/* Floating decorations */}
        <motion.div
          animate={{ x: [0, 20, -20, 0], y: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 12 }}
          className="absolute w-32 h-32 bg-white opacity-10 rounded-full top-4 right-4 blur-2xl"
        />
        
        <div className="flex items-center space-x-6 relative z-10">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ rotate: { repeat: Infinity, duration: 4 } }}
            className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center border-4 border-white border-opacity-30 backdrop-blur-sm"
          >
            <UserIcon className="w-10 h-10 text-white" />
          </motion.div>
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold mb-2"
            >
              Welcome back!
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl opacity-90 mb-3"
            >
              Hello, {anonymousName}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center"
            >
              <span className={`px-4 py-2 text-sm rounded-full backdrop-blur-sm ${
                institutionType === 'educational' 
                  ? 'bg-blue-500 bg-opacity-30 border border-blue-300' 
                  : 'bg-gray-500 bg-opacity-30 border border-gray-300'
              }`}>
                {institution}
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <Link 
            href="/prompt" 
            className="block bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all h-full min-h-[140px] relative overflow-hidden"
          >
            <motion.div
              animate={{ x: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 8 }}
              className="absolute w-24 h-24 bg-white opacity-10 rounded-full top-2 right-2 blur-xl"
            />
            <div className="flex flex-col h-full relative z-10 justify-between">
              <motion.div 
                whileHover={{ rotate: 15 }}
                className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm w-fit"
              >
                <ChatBubbleLeftIcon className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="font-bold text-lg mb-1">💬 AI Chat</h3>
                <p className="text-sm opacity-90">Talk with SoulSync</p>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.65 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <Link 
            href="/screening" 
            className="block bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all h-full min-h-[140px] relative overflow-hidden"
          >
            <motion.div
              animate={{ x: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 10 }}
              className="absolute w-20 h-20 bg-white opacity-10 rounded-full bottom-2 right-2 blur-xl"
            />
            <div className="flex flex-col h-full relative z-10 justify-between">
              <motion.div 
                whileHover={{ rotate: 15 }}
                className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm w-fit"
              >
                <ClipboardDocumentCheckIcon className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="font-bold text-lg mb-1">📋 Screening</h3>
                <p className="text-sm opacity-90">Mental health assessments</p>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <Link 
            href="/resources" 
            className="block bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all h-full min-h-[140px] relative overflow-hidden"
          >
            <motion.div
              animate={{ x: [0, 12, -12, 0] }}
              transition={{ repeat: Infinity, duration: 9 }}
              className="absolute w-28 h-28 bg-white opacity-10 rounded-full top-1 left-1 blur-xl"
            />
            <div className="flex flex-col h-full relative z-10 justify-between">
              <motion.div 
                whileHover={{ rotate: 15 }}
                className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm w-fit"
              >
                <BookOpenIcon className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="font-bold text-lg mb-1">📚 Resources</h3>
                <p className="text-sm opacity-90">Youth mental wellness hub</p>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.75 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <Link 
            href="/helplines" 
            className="block bg-gradient-to-br from-red-500 via-pink-500 to-rose-500 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all h-full min-h-[140px] relative overflow-hidden"
          >
            <motion.div
              animate={{ x: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 7 }}
              className="absolute w-24 h-24 bg-white opacity-10 rounded-full top-2 right-2 blur-xl"
            />
            <div className="flex flex-col h-full relative z-10 justify-between">
              <motion.div 
                whileHover={{ rotate: 15 }}
                className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm w-fit"
              >
                <span className="text-2xl">📞</span>
              </motion.div>
              <div>
                <h3 className="font-bold text-lg mb-1">📞 Helplines</h3>
                <p className="text-sm opacity-90">Crisis support & counseling</p>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <Link 
            href="/profile" 
            className="block bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-500 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all h-full min-h-[140px] relative overflow-hidden"
          >
            <motion.div
              animate={{ x: [0, 8, -8, 0] }}
              transition={{ repeat: Infinity, duration: 11 }}
              className="absolute w-32 h-32 bg-white opacity-10 rounded-full bottom-2 right-2 blur-xl"
            />
            <div className="flex flex-col h-full relative z-10 justify-between">
              <motion.div 
                whileHover={{ rotate: 15 }}
                className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm w-fit"
              >
                <UserIcon className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="font-bold text-lg mb-1">👤 Profile</h3>
                <p className="text-sm opacity-90">Manage settings</p>
              </div>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Mental Health Features Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid md:grid-cols-2 gap-6 mb-8"
      >
        {/* Screening Section */}
        <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-purple-200 border-opacity-20">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-500 rounded-xl mr-4">
              <ClipboardDocumentCheckIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Mental Health Screening</h3>
              <p className="text-sm text-gray-600">Take validated assessments</p>
            </div>
          </div>
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between p-3 bg-white bg-opacity-50 rounded-lg">
              <div>
                <span className="font-medium text-gray-800">PHQ-9</span>
                <p className="text-xs text-gray-600">Depression screening</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">9 questions</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white bg-opacity-50 rounded-lg">
              <div>
                <span className="font-medium text-gray-800">GAD-7</span>
                <p className="text-xs text-gray-600">Anxiety screening</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">7 questions</span>
            </div>
          </div>
          <Link href="/screening" className="block w-full bg-purple-600 text-white text-center py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
            Start Assessment
          </Link>
        </div>

        {/* Resources Section */}
        <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-orange-200 border-opacity-20">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-orange-500 rounded-xl mr-4">
              <PlayIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Wellness Resources</h3>
              <p className="text-sm text-gray-600">Videos, audio, and guides</p>
            </div>
          </div>
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between p-3 bg-white bg-opacity-50 rounded-lg">
              <div className="flex items-center">
                <span className="mr-2">🎥</span>
                <span className="font-medium text-gray-800">Mental Health Videos</span>
              </div>
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Regional</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white bg-opacity-50 rounded-lg">
              <div className="flex items-center">
                <span className="mr-2">🎧</span>
                <span className="font-medium text-gray-800">Guided Meditations</span>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Audio</span>
            </div>
          </div>
          <Link href="/resources" className="block w-full bg-orange-600 text-white text-center py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors">
            Explore Resources
          </Link>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gradient-to-br from-white via-blue-50 to-purple-50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white border-opacity-20 relative overflow-hidden"
      >
        <motion.div
          animate={{ x: [0, 25, -25, 0], y: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 15 }}
          className="absolute w-40 h-40 bg-gradient-to-r from-blue-200 to-purple-200 opacity-20 rounded-full top-4 right-4 blur-2xl"
        />
        
        <h2 className="text-3xl font-bold mb-8 text-gray-800 relative z-10">Your Wellness Journey</h2>
        <div className="text-center py-12 relative z-10">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 rounded-full flex items-center justify-center mb-6 shadow-lg"
          >
            <PlusIcon className="w-12 h-12 text-gray-600" />
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-2xl font-semibold text-gray-800 mb-4"
          >
            Start Your Wellness Journey
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed"
          >
            Begin by chatting with our AI companion and building healthy mental wellness habits.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="flex justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/prompt" 
                className="flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl font-medium h-14 w-full sm:w-auto min-w-[200px]"
              >
                <ChatBubbleLeftIcon className="w-5 h-5" />
                <span>Start Chatting</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Global floating elements */}
      <motion.div
        animate={{ x: [0, 30, -30, 0], y: [0, 20, -20, 0] }}
        transition={{ repeat: Infinity, duration: 15 }}
        className="fixed w-96 h-96 bg-blue-200 opacity-5 rounded-full top-10 right-10 blur-3xl -z-50"
      />
      <motion.div
        animate={{ x: [0, -25, 25, 0], y: [0, -15, 15, 0] }}
        transition={{ repeat: Infinity, duration: 18 }}
        className="fixed w-80 h-80 bg-purple-200 opacity-5 rounded-full bottom-10 left-10 blur-3xl -z-50"
      />
    </div>
  );
}