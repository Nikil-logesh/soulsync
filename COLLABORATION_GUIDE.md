# 🤝 SoulSync Collaboration Guide

## Quick Setup for New Contributors

### 1. Prerequisites
- **Node.js** (v16 or higher)
- **pnpm** (recommended) or npm
- **Git**
- **VS Code** (recommended)

### 2. Get the Code

#### Option A: Direct Collaboration (Recommended)
```bash
# Clone the repository
git clone https://github.com/Nikil-logesh/soulsync.git
cd soulsync

# Install dependencies
pnpm install
# or: npm install

# Start development server
pnpm dev
# or: npm run dev
```

#### Option B: Fork & Pull Request
1. Fork the repo on GitHub
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/soulsync.git`
3. Add upstream: `git remote add upstream https://github.com/Nikil-logesh/soulsync.git`

### 3. Development Workflow

#### Starting the Application
```bash
# Start all services (web app + backend)
pnpm dev

# Or start individual services
cd apps/web-new && pnpm dev    # Frontend only
cd apps/backend && python main.py  # Backend only
```

#### Making Changes
```bash
# Create a new branch for your feature
git checkout -b feature/your-feature-name

# Make your changes
# ... edit files ...

# Commit changes
git add .
git commit -m "Add: description of your changes"

# Push to GitHub
git push origin feature/your-feature-name
```

#### Syncing with Main Repository
```bash
# Pull latest changes from main
git checkout main
git pull origin main

# Update your feature branch
git checkout feature/your-feature-name
git rebase main
```

### 4. Project Structure
```
soulsync/
├── apps/
│   ├── web-new/          # Main Next.js frontend
│   │   ├── src/app/      # App Router pages
│   │   ├── components/   # Reusable components
│   │   └── contexts/     # React contexts
│   ├── backend/          # FastAPI backend
│   └── developer-panel/  # Admin panel
├── packages/             # Shared packages
└── docs/                # Documentation
```

### 5. Key Files to Know
- **Homepage**: `apps/web-new/src/app/page.tsx`
- **Dashboard**: `apps/web-new/src/app/dashboard/page.tsx`
- **Components**: `apps/web-new/src/components/`
- **Styling**: Mostly inline styles, some Tailwind CSS
- **Backend**: `apps/backend/main.py`

### 6. Development Tips

#### Hot Reloading
- Frontend changes appear instantly
- Backend requires restart for most changes

#### Environment Setup
```bash
# Check if everything works
pnpm dev

# Should open:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000 (if running)
```

#### Common Commands
```bash
# Install new dependencies
pnpm add package-name

# Run linting
pnpm lint

# Build for production
pnpm build

# Format code
pnpm format
```

### 7. Collaboration Best Practices

#### Code Style
- Use TypeScript for new components
- Follow existing naming conventions
- Add comments for complex logic
- Use meaningful commit messages

#### Git Workflow
- **Small commits**: Make focused, atomic changes
- **Descriptive messages**: `Add user authentication`, not `fix stuff`
- **Test before pushing**: Ensure code runs locally
- **Pull requests**: Use PRs for code review

#### Communication
- Use GitHub Issues for bug reports
- Use GitHub Discussions for questions
- Comment on complex code changes
- Tag @Nikil-logesh for urgent reviews

### 8. Common Issues & Solutions

#### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
# Then restart: pnpm dev
```

#### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### Git Conflicts
```bash
# Resolve conflicts in VS Code
# Then: git add . && git commit
```

### 9. Getting Help
- 📖 **Documentation**: Check `/docs` folder
- 🐛 **Issues**: Create GitHub issue
- 💬 **Questions**: GitHub Discussions or Discord
- 📧 **Direct contact**: Tag @Nikil-logesh

---

## Ready to Contribute? 🚀

1. **Clone the repo**
2. **Run `pnpm dev`**
3. **Open `localhost:3000`**
4. **Start coding!**

Happy coding! 🎉