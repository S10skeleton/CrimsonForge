# Quick Start Guide

## Initial Setup (5 minutes)

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Set Up Environment
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your keys:
- **Required now**: `ANTHROPIC_API_KEY` (get from https://console.anthropic.com/)
- **Required later**: `MITCHELL_API_KEY` (when you get access)
- **Optional**: Update `MONGODB_URI` if not using local MongoDB

### 3. Start MongoDB
```bash
# Option A: Local MongoDB
mongod

# Option B: MongoDB Atlas (cloud)
# Just update MONGODB_URI in .env with your connection string
```

### 4. Start the Application
```bash
# From project root
npm run dev
```

This starts:
- Backend API: http://localhost:3001
- Frontend UI: http://localhost:5173

## First Ticket Workflow

1. **Open frontend**: http://localhost:5173
2. **Click "New Ticket"**
3. **Enter vehicle info**:
   - VIN: 1HGCM82633A123456 (example)
   - Year: 2023
   - Make: Honda
   - Model: Accord
   - Engine: 2.0L Turbo
4. **Enter customer concern**: "Check engine light on, rough idle"
5. **Click "Create Ticket"**
6. **Start chatting with AI**:
   - "What DTCs are commonly associated with rough idle on this engine?"
   - "What should I check first?"
   - "Show me the procedure for cleaning the throttle body"

## Testing Without Mitchell API Key

The system works fully without the Mitchell key! Here's what you can do:

✅ **Working Now:**
- Create and manage tickets
- Chat with AI assistant
- Track diagnostic steps
- Manage parts lists
- Update ticket status
- Generate documentation

❌ **Needs Mitchell Key:**
- Fetching real torque specs
- Getting actual procedures
- Retrieving TSBs
- Real parts data

The AI will tell you when it needs Mitchell data and explain what it would fetch.

## Common Commands

```bash
# Start everything
npm run dev

# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend

# Build for production
npm run build

# Install dependencies
npm run install:all
```

## Troubleshooting

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
mongod

# Or check your MONGODB_URI in .env
```

### Port Already in Use
```bash
# Change ports in:
# - backend/.env (PORT=3001)
# - frontend/vite.config.ts (port: 5173)
```

### Missing API Key Error
```bash
# Add to backend/.env:
ANTHROPIC_API_KEY=sk-ant-...
```

## Project Structure at a Glance

```
mechanic-ai-helper/
├── backend/          # Node.js API server
├── frontend/         # React web app
└── shared/           # Shared TypeScript types
```

## What's Next?

1. **Get your Mitchell ProDemand API key** and add it to `.env`
2. **Test the diagnostic flow** with real shop scenarios
3. **Customize the UI** to match your shop's workflow
4. **Deploy to production** when ready

## Need Help?

Check the main README.md for:
- Detailed API documentation
- Architecture overview
- Deployment guides
- Feature roadmap
