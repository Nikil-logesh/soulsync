# Firebase Deployment Guide for Mental Wellness Platform

## 🎯 **Goal**: Deploy your Next.js mental wellness app to Firebase Hosting with a public URL

## 📋 **Prerequisites**
- Node.js installed
- Your project running locally on port 3000
- Google account for Firebase
- Firebase CLI installed

---

## 🚀 **Step-by-Step Deployment Process**

### **Step 1: Install Firebase CLI**
```bash
npm install -g firebase-tools
```

### **Step 2: Login to Firebase**
```bash
firebase login
```
- This will open your browser
- Login with your Google account
- Allow Firebase CLI access

### **Step 3: Initialize Firebase in Your Project**
Navigate to your project root and run:
```bash
cd A:\ss\mental-wellness-app\apps\web-new
firebase init
```

**During initialization, select:**
- ✅ **Hosting: Configure files for Firebase Hosting**
- ✅ **Functions: Configure a Cloud Functions directory** (optional, for API routes)
- Use an existing project or create a new one
- Choose project name: `mental-wellness-indian-youth`

**Configuration choices:**
- Public directory: `out` (for static export)
- Configure as single-page app: `Yes`
- Set up automatic builds with GitHub: `No` (for now)
- Overwrite index.html: `No`

### **Step 4: Configure Next.js for Static Export**
Create/update `next.config.ts`:
```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'https://your-app-name.web.app',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
}

module.exports = nextConfig
```

### **Step 5: Update Package.json Scripts**
Add export script to `package.json`:
```json
{
  "scripts": {
    "build": "next build",
    "export": "next export",
    "build-and-export": "next build && next export",
    "firebase-deploy": "npm run build-and-export && firebase deploy"
  }
}
```

### **Step 6: Environment Variables Setup**
Create `.env.production` file:
```env
NEXTAUTH_URL=https://your-project-id.web.app
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GEMINI_API_KEY=your-gemini-api-key
```

### **Step 7: Update Firebase Configuration**
Update `firebase.json`:
```json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=3600"
          }
        ]
      }
    ]
  }
}
```

### **Step 8: Handle NextAuth for Static Export**
Since NextAuth requires server-side functionality, we'll need to modify the authentication approach for static hosting:

**Option A: Remove NextAuth and use Firebase Auth**
**Option B: Deploy to Vercel instead (recommended for Next.js)**

### **Step 9: Build and Deploy**
```bash
# Build the project
npm run build-and-export

# Deploy to Firebase
firebase deploy
```

### **Step 10: Configure Custom Domain (Optional)**
```bash
firebase hosting:sites:create your-custom-domain
firebase target:apply hosting main your-custom-domain
firebase deploy --only hosting:main
```

---

## ⚠️ **Important Considerations**

### **Authentication Issue with Static Export**
NextAuth doesn't work with static exports. You have 3 options:

**Option 1: Use Firebase Authentication (Recommended)**
- Replace NextAuth with Firebase Auth
- Simpler for static hosting
- Better integration with Firebase

**Option 2: Deploy to Vercel (Alternative)**
- Vercel natively supports Next.js with server functions
- No need to modify authentication
- Better for Next.js apps

**Option 3: Use Firebase Functions**
- Keep NextAuth but deploy API routes as Firebase Functions
- More complex setup

### **Environment Variables**
- Set environment variables in Firebase console
- Or use Firebase Functions config

---

## 🎯 **Recommended Approach**

Since your app uses NextAuth and has API routes, I recommend **Vercel deployment** instead:

### **Vercel Deployment (Easier for Next.js)**
1. Push code to GitHub
2. Connect GitHub to Vercel
3. Deploy automatically
4. Add environment variables in Vercel dashboard

Would you like me to:
1. **Convert to Firebase Auth** and continue with Firebase Hosting?
2. **Guide you through Vercel deployment** (recommended)?
3. **Set up Firebase Functions** for API routes?

Let me know which approach you prefer!