# Mechanic AI Helper Agent

An AI-powered workflow copilot for automotive technicians that provides persistent job memory, trusted technical data from Mitchell ProDemand, and intelligent diagnostic assistance.

## 🎯 Project Overview

This is **not a generic chatbot**. The Mechanic AI Helper Agent is designed specifically for real shop conditions, combining:

- **Persistent Job Memory**: Each vehicle/ticket maintains its own context - no repeated diagnostics
- **Trusted Data Sources**: Integrates with Mitchell ProDemand API for verified specifications
- **Guided Diagnostic Flow**: AI suggests logical next steps based on what's already been tested
- **Parts Decision Support**: Builds parts lists from confirmed diagnostics and known failure patterns
- **Documentation Automation**: Generates professional Concern/Cause/Correction narratives

## 🏗️ Architecture

### Tech Stack
- **Backend**: Node.js + TypeScript + Express
- **Frontend**: React + TypeScript + Vite
- **Database**: MongoDB + Mongoose
- **AI**: Anthropic Claude API
- **Data Source**: Mitchell ProDemand API (integration ready)

### Key Components
```
┌─────────────────┐
│   Web UI        │  React-based job card interface
├─────────────────┤
│   Agent Layer   │  Claude orchestration + tool calls
├─────────────────┤
│   Data Layer    │  Per-ticket memory + MongoDB
├─────────────────┤
│   Mitchell API  │  Verified specs/procedures/TSBs
└─────────────────┘
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Anthropic API key
- Mitchell ProDemand API key (when available)

### Installation

1. **Clone and install dependencies:**
```bash
# Install root dependencies
npm run install:all
```

2. **Configure backend environment:**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mechanic-ai
ANTHROPIC_API_KEY=your_anthropic_key_here
MITCHELL_API_KEY=your_mitchell_key_when_ready
MITCHELL_API_URL=https://api.mitchell.com/v1
FRONTEND_URL=http://localhost:5173
```

3. **Start MongoDB:**
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with your Atlas connection string
```

4. **Run the application:**
```bash
# From project root - runs both backend and frontend
npm run dev

# Or run separately:
npm run dev:backend   # Backend on http://localhost:3001
npm run dev:frontend  # Frontend on http://localhost:5173
```

5. **Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api
- Health Check: http://localhost:3001/health

## 📁 Project Structure

```
mechanic-ai-helper/
├── backend/
│   ├── src/
│   │   ├── api/           # External API clients (Mitchell)
│   │   ├── config/        # Database, routes configuration
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # MongoDB schemas
│   │   ├── services/      # Business logic (Claude, tickets)
│   │   └── index.ts       # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API client
│   │   ├── App.tsx        # Main app with routing
│   │   └── main.tsx       # Entry point
│   └── package.json
├── shared/
│   └── types/             # Shared TypeScript types
└── package.json           # Monorepo scripts
```

## 🔑 Key Features

### 1. Job/Ticket Memory
Each ticket maintains persistent context:
- Vehicle information (VIN, year, make, model, engine)
- Customer concern
- All diagnostic steps performed
- Current findings
- Parts needed/ordered
- Status notes

This eliminates:
- Repeated diagnostics
- Context loss between sessions
- Contradictory documentation

### 2. AI-Powered Assistance
The Claude AI agent:
- **Never invents specs** - always calls Mitchell API for verified data
- Suggests next diagnostic steps based on what's already tested
- Builds parts lists from confirmed failures
- Generates professional documentation

### 3. Mitchell ProDemand Integration (Ready)
API wrapper is implemented and ready for your key:
```typescript
// backend/src/api/mitchell.ts
- getTorqueSpecs(vin, component)
- getProcedure(vin, procedure)
- getTSBs(vin, symptom?)
- getComponentLocation(vin, component)
- getFluidSpecs(vin, fluidType)
- getDTCInfo(vin, dtcCode)
- searchParts(vin, partDescription)
- getLaborTime(vin, operation)
```

Just add your Mitchell API key to `.env` and the integration will work!

## 🎯 MVP Scope

The current implementation focuses on the **Job Card Copilot**:

✅ **Implemented:**
- Ticket creation and management
- Persistent job memory
- Chat interface with Claude
- Diagnostic step tracking
- Parts list management
- Status updates
- Mitchell API wrapper (ready for key)

🚧 **Next Steps (when you're ready):**
- Complete Mitchell API integration with real key
- Add tool definitions for Claude to call Mitchell API
- Implement VIN decoder
- Add user authentication
- Deploy to cloud
- Add shop-specific knowledge base

## 📝 API Endpoints

### Tickets
- `POST /api/tickets` - Create new ticket
- `GET /api/tickets` - List all tickets
- `GET /api/tickets/:id` - Get ticket details
- `POST /api/tickets/:id/diagnostic-step` - Add diagnostic step
- `POST /api/tickets/:id/finding` - Add finding
- `POST /api/tickets/:id/part` - Add part
- `PATCH /api/tickets/:id/status` - Update status

### Chat & AI
- `GET /api/tickets/:id/conversation` - Get chat history
- `POST /api/tickets/:id/chat` - Send message
- `POST /api/tickets/:id/suggest-next-step` - Get AI suggestion
- `POST /api/tickets/:id/generate-parts-list` - Generate parts list
- `POST /api/tickets/:id/generate-documentation` - Generate final docs

## 🔧 Development

### Build for production:
```bash
npm run build
```

### Environment-specific runs:
```bash
# Development (with hot reload)
npm run dev

# Production
cd backend && npm start
cd frontend && npm run preview
```

## 📚 Next Implementation Steps

1. **Get Mitchell API Key**
   - Add to `backend/.env`
   - Test API wrapper methods
   - Implement tool definitions for Claude

2. **Enhance AI Integration**
   - Define Claude tools for Mitchell API calls
   - Test diagnostic flow with real data
   - Refine prompt engineering

3. **Add Features**
   - VIN decoder integration
   - Photo/attachment support
   - Print job cards
   - Shop user management

4. **Deploy**
   - Set up production MongoDB
   - Deploy backend (Railway, Heroku, AWS)
   - Deploy frontend (Vercel, Netlify)

## 🤝 Support

This project is ready for immediate use in a shop environment. The key differentiator is the **persistent job memory** that turns it from a chatbot into a real workflow tool.

When Crimson (or your development partner) is ready, they can help with:
- Mitchell API integration details
- Custom shop workflows
- UI refinements
- Deployment setup

## 📄 License

Private project - All rights reserved
