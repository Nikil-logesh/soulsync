'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChatBubbleLeftIcon, UserIcon, HomeIcon, InformationCircleIcon, PhoneIcon, ClipboardDocumentCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useSafeAuth } from '../contexts/useSafeAuth';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, signOut } = useSafeAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSignIn = () => {
    router.push('/signin');
  };

  // Don't show navbar on signin page
  if (pathname === '/signin') {
    return null;
  }

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-between px-6 py-3 rounded-2xl shadow-2xl bg-white/80 backdrop-blur-md border border-white/20 w-[95%] max-w-6xl"
    >
      <Link href={user ? '/dashboard' : '/'}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2"
        >
          <motion.img 
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            src="/soulsync-logo.svg"
            alt="SoulSync"
            className="w-8 h-8"
          />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer">
            SoulSync
          </h1>
        </motion.div>
      </Link>
      
      <div className="flex items-center space-x-4">
        {/* Always available links */}
        <NavLink href="/screening" icon={ClipboardDocumentCheckIcon}>Screening</NavLink>
        <NavLink href="/resources" icon={InformationCircleIcon}>Resources</NavLink>
        <NavLink href="/helplines" icon={PhoneIcon}>Helplines</NavLink>
        
        {/* Campus Integration for admins */}
        {!loading && !user && (
          <NavLink href="/integrate-campus" icon={InformationCircleIcon}>Campus</NavLink>
        )}
        
        {/* Loading state */}
        {loading && (
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-gray-500 text-sm"
          >
            Loading...
          </motion.div>
        )}
        
        {/* Authenticated user links */}
        {!loading && user && (
          <>
            <NavLink href="/dashboard" icon={HomeIcon}>Dashboard</NavLink>
            <NavLink href="/prompt" icon={ChatBubbleLeftIcon} highlight>Chat</NavLink>
            
            <div className="flex items-center space-x-3">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <UserIcon className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs text-green-700 font-medium">
                  {user.email?.split('@')[0] || 'User'}
                </span>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-shadow"
              >
                Sign Out
              </motion.button>
            </div>
          </>
        )}
        
        {/* Unauthenticated user */}
        {!loading && !user && (
          <div className="flex items-center space-x-2">
            {/* Navigation only - no guest features */}
          </div>
        )}
      </div>
    </motion.nav>
  );
}

// NavLink component for cleaner code
function NavLink({ 
  href, 
  children, 
  icon: Icon, 
  highlight = false,
  isLimited = false,
  urgent = false
}: { 
  href: string; 
  children: React.ReactNode; 
  icon: any; 
  highlight?: boolean;
  isLimited?: boolean;
  urgent?: boolean;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center space-x-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all relative ${
          urgent
            ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700 shadow-md border border-red-300'
            : highlight 
            ? isLimited
              ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 shadow-md'
              : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 shadow-md' 
            : 'hover:bg-gray-50 text-gray-700 hover:text-blue-600'
        }`}
      >
        <Icon className="w-4 h-4" />
        <span>{children}</span>
        {isLimited && (
          <span className="text-xs bg-yellow-400 text-yellow-900 px-1 rounded-full">3</span>
        )}
        {urgent && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
          />
        )}
      </motion.div>
    </Link>
  );
}