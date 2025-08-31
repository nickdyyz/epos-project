# EPOS - Emergency Plan Organization System

**Version:** 1.0.0  
**Last Updated:** August 30, 2025  
**Status:** Development - Frontend & API ✅, Backend Integration Pending  

## 🚨 Overview

EPOS is a comprehensive emergency plan generation system that helps organizations create customized emergency response plans using AI-powered analysis and industry best practices.

## ✨ Recent Updates (August 30, 2025)

### ✅ Tooltip System Refactor - COMPLETED
- **Complete tooltip system overhaul** for consistent user experience
- **Unified tooltip state management** - single system for all tooltips
- **Cross-page consistency** - tooltips now work reliably on all form pages
- **Scroll-aware positioning** - tooltips follow user scroll position
- **Enhanced user guidance** - comprehensive help text for all form fields and hazards

### ✅ Hazard Definitions Enhanced
- **Human-caused Hazards**: Added "Active Aggressor" and "Anonymous Threats"
- **Technological Hazards**: Split "Hazardous Chemical Release" into fixed site and transportation variants
- **Comprehensive definitions** for all hazard types

### ✅ API Server Stabilization
- **Flask API running reliably** on port 5002
- **Python environment resolved** - all dependencies properly installed
- **Port conflicts resolved** - stable API endpoint

## 🏗️ System Architecture

```
Frontend (React + Vite) ←→ Flask API ←→ Ollama AI (llama3.2:1b)
     ↓                        ↓                    ↓
  User Interface         Plan Generation      AI Analysis
  (localhost:4000)      (localhost:5002)    (Local Model)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- Ollama with llama3.2:1b model

### Frontend Setup
```bash
cd emplan-web-vite
npm install
npm run dev -- --port 4000
```
Frontend will be available at: http://localhost:4000

### API Setup
```bash
cd emplan-web-vite
source ../.venv/bin/activate
python3 plan_generation_api.py
```
API will be available at: http://localhost:5002

### Ollama Setup
```bash
ollama pull llama3.2:1b
ollama serve
```

## 🎯 Core Features

### ✅ Implemented Features
- **User Authentication** (AWS Cognito via Amplify)
- **Organization Profile Management** (localStorage)
- **Multi-step Emergency Plan Form**
- **AI-Powered Plan Generation** (Ollama integration)
- **Comprehensive Hazard Library** (Natural, Human-caused, Technological)
- **Interactive Tooltips** (Unified system across all pages)
- **Plan Preview & Download** (PDF generation)
- **Responsive Design** (Tailwind CSS)

### 🔄 In Progress
- **AWS Backend Integration** (DynamoDB for data persistence)
- **Production Deployment** (S3/CloudFront)

### 📋 Planned Features
- **Plan Templates Library**
- **Collaborative Editing**
- **Version Control**
- **Compliance Tracking**

## 📁 Project Structure

```
emplan-web-vite/
├── src/
│   ├── EnhancedPlanForm.jsx     # Main form component (tooltip system)
│   ├── Dashboard.jsx            # User dashboard
│   ├── CustomAuth.jsx           # Authentication
│   ├── PlanViewer.jsx           # Plan display
│   ├── hooks/                   # Custom React hooks
│   └── components/              # Reusable components
├── plan_generation_api.py       # Flask API server
├── api_requirements.txt         # Python dependencies
└── README.md                    # This file
```

## 🛠️ Technical Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **AWS Amplify** - Authentication

### Backend
- **Flask** - API framework
- **Ollama** - Local AI model
- **ReportLab** - PDF generation
- **Markdown** - Text processing

### Infrastructure
- **AWS Cognito** - User authentication
- **AWS AppSync** - GraphQL API (planned)
- **AWS DynamoDB** - Data storage (planned)

## 🎨 User Interface

### Form Sections
1. **Organization Details** - Basic organization information
2. **Scope & Coverage** - Plan scope and coverage areas
3. **Hazard Identification** - Primary and secondary hazards
4. **Special Considerations** - Unique requirements and constraints
5. **Review & Generate** - Final review and plan generation

### Tooltip System
- **Unified tooltip state** for consistent behavior
- **Scroll-aware positioning** for better UX
- **Comprehensive help text** for all form fields
- **Hazard-specific descriptions** for informed selection

## 🔧 Development

### Key Components

#### EnhancedPlanForm.jsx
- **Unified tooltip system** with single state management
- **Multi-step form navigation** with validation
- **Hazard selection** with comprehensive definitions
- **AI integration** for plan generation

#### Tooltip Implementation
```javascript
// Single tooltip state
const [tooltip, setTooltip] = useState({ show: false, content: '', title: '' });

// Unified functions
const showTooltip = (title, content) => {
  setTooltip({ show: true, title, content });
};

const hideTooltip = () => {
  setTooltip({ show: false, content: '', title: '' });
};
```

### Custom Hooks
- **useOrganizationProfileUnified** - Organization data management
- **useHazardIntelligence** - Hazard suggestions and validation

## 🚀 Deployment

### Development
- Frontend: `npm run dev -- --port 4000`
- API: `python3 plan_generation_api.py`
- Ollama: `ollama serve`

### Production (Planned)
- Frontend: AWS S3 + CloudFront
- API: AWS Lambda + API Gateway
- Database: AWS DynamoDB
- Authentication: AWS Cognito

## 📊 Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend UI | ✅ Complete | Tooltip system refactored |
| User Authentication | ✅ Complete | AWS Cognito integration |
| Plan Generation API | ✅ Complete | Flask + Ollama |
| Data Storage | 🔄 Pending | Currently localStorage |
| Production Deployment | 📋 Planned | AWS infrastructure |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (especially tooltips)
5. Submit a pull request

## 📝 License

This project is proprietary software. All rights reserved.

---

**Last Updated:** August 30, 2025  
**Next Milestone:** AWS Backend Integration
