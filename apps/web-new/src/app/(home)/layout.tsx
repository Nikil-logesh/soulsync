// 'use client';

// import { ReactNode } from "react";
// import AuthProvider from "@/components/AuthProvider";

// export default function HomeLayout({ children }: { children: ReactNode }) {
//   return (
//     <AuthProvider>
//       {children}
//     </AuthProvider>
//   );
// }

// apps/web-new/app/(home)/layout.tsx
'use client'

import { ReactNode } from 'react'
import AuthProvider from '@/components/AuthProvider'

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 text-gray-800">
        {children}
      </div>
    </AuthProvider>
  )
}
