import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

console.log('NextAuth Config Loading...', {
  clientId: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing',
  nextAuthUrl: process.env.NEXTAUTH_URL,
  nextAuthSecret: process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing'
});

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/signin',
  },
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async signIn({ profile }) {
      console.log('SignIn callback:', { email: profile?.email });
      
      // Get email domain
      const emailDomain = profile?.email?.split('@')[1];
      
      // Add domain information to the user's profile
      if (emailDomain) {
        let institution = 'Individual';
        
        // Map domains to institutions (expand this list as needed)
        const domainMap: { [key: string]: string } = {
          'sairamtap.edu.in': 'Sairam Engineering College',
          'iitm.ac.in': 'IIT Madras',
          'anna.edu.in': 'Anna University',
          'vit.edu.in': 'VIT University',
        };

        // Check if the domain matches any educational institution
        if (domainMap[emailDomain]) {
          institution = domainMap[emailDomain];
        }

        console.log('User institution:', institution);
        return true; // Allow sign in
      }
      
      return true; // Allow sign in for all other cases
    },
    async session({ session, token }) {
      // Add custom session data
      if (session.user?.email) {
        const emailDomain = session.user.email.split('@')[1];
        
        // Generate anonymous name (consistent based on email)
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

        (session.user as any).domain = emailDomain;
        (session.user as any).anonymousName = generateAnonymousName(session.user.email);
      }
      
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };