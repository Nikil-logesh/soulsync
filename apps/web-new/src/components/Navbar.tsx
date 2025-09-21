'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChatBubbleLeftIcon, UserIcon, HomeIcon, InformationCircleIcon, PhoneIcon, ClipboardDocumentCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/signin' });
  };

  // Don't show navbar on signin page - use usePathname for SSR compatibility
  if (pathname === '/signin') {
    return null;
  }

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-between px-6 py-3 rounded-2xl shadow-2xl bg-white/80 backdrop-blur-md border border-white/20 w-[95%] max-w-6xl"
    >
      <Link href={status === 'authenticated' ? '/dashboard' : '/'}>
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
        <NavLink href="/emergency" icon={ExclamationTriangleIcon} urgent>Emergency</NavLink>
        <NavLink href="/about" icon={InformationCircleIcon}>About</NavLink>
        <NavLink href="/contact" icon={PhoneIcon}>Contact</NavLink>
        
        {/* Guest-accessible limited chat */}
        {status === 'unauthenticated' && (
          <NavLink href="/guest-chat" icon={ChatBubbleLeftIcon} highlight isLimited>
            Try Chat
          </NavLink>
        )}
        
        {/* Authenticated user links */}
        {status === 'authenticated' && (
          <>
            <NavLink href="/dashboard" icon={HomeIcon}>Dashboard</NavLink>
            <NavLink href="/prompt" icon={ChatBubbleLeftIcon} highlight>Chat</NavLink>
          </>
        )}
        
        {status === 'loading' && (
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-gray-500 text-sm"
          >
            Loading...
          </motion.div>
        )}
        
        {status === 'authenticated' && session?.user ? (
          <div className="flex items-center space-x-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full"
            >
              <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <UserIcon className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs text-gray-700 font-medium">
                Anonymous User
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
        ) : null}
        
        {status === 'unauthenticated' && (
          <div className="flex items-center space-x-2">
            <motion.div 
              className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-full"
            >
              <span className="text-xs text-yellow-700 font-medium">
                👋 Guest Mode
              </span>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/signin')}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-shadow"
            >
              Sign In
            </motion.button>
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