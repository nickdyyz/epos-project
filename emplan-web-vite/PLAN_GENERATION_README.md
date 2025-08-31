# Emergency Plan Generation Integration

This document explains how to use the integrated emergency plan generation system.

## 🚀 Quick Start

### 1. Start the Plan Generation API

```bash
# In the emplan-web-vite directory
./start_api.sh
```

This will:
- Check for Python 3 and required dependencies
- Install missing packages if needed
- Check if Ollama is running
- Start the API server on http://localhost:5000

### 2. Start the Frontend

```bash
# In another terminal, in the emplan-web-vite directory
npm run dev -- --port 3001
```

### 3. Use the System

1. **Sign in** to the application at http://localhost:3001
2. **Click "Create New Plan"** from the dashboard
3. **Fill out the form** with your organization details
4. **Click "Create Emergency Plan"** to generate the plan
5. **View and download** the generated plan

## 🔧 System Architecture

### Frontend (React + Vite)
- **EnhancedPlanForm.jsx**: Modern form with progress tracking, tooltips, validation, and auto-save
- **PlanViewer.jsx**: Component to display generated plans with proper formatting
- **Dashboard.jsx**: Main dashboard with plan management

### Backend (Flask API)
- **plan_generation_api.py**: Flask server that integrates with the local model
- **API Endpoints**:
  - `POST /api/generate-plan`: Generate emergency plan from form data
  - `GET /api/health`: Health check
  - `GET /api/plans`: List all generated plans
  - `GET /api/plans/<filename>`: Get specific plan content

### AI Model (Ollama)
- **Model**: llama3.2:1b (configurable)
- **Context**: Uses processed emergency management documents
- **Output**: Markdown-formatted emergency plans

## 📋 Features

### Enhanced Plan Form
- ✅ **Progress Tracking**: Visual progress bar and step indicators
- ✅ **Tooltips**: Helpful explanations for each field
- ✅ **Form Validation**: Real-time validation with error messages
- ✅ **Auto-Save**: Automatically saves progress to localStorage
- ✅ **Modern UI**: Beautiful gradient backgrounds and glassmorphism effects

### Plan Generation
- ✅ **AI-Powered**: Uses local Ollama model for generation
- ✅ **Context-Aware**: Leverages emergency management best practices
- ✅ **Customized**: Tailored to organization type, location, and hazards
- ✅ **Professional**: Generates comprehensive, well-structured plans

### Plan Viewer
- ✅ **Rich Display**: Formatted markdown with proper styling
- ✅ **Download**: Export plans as markdown files
- ✅ **Summary**: Shows hazard identification and special considerations
- ✅ **Responsive**: Works on all screen sizes

## 🛠️ Configuration

### Model Configuration
Edit `plan_generation_api.py` to change the model:
```python
generator = EmergencyPlanGenerator(model_name="llama3.2:1b")
```

### API Configuration
Edit the API URL in `EnhancedPlanForm.jsx`:
```javascript
const response = await fetch('http://localhost:5000/api/generate-plan', {
```

### Form Fields
Add new fields to the form by updating:
- `EnhancedPlanForm.jsx`: Add form fields and validation
- `plan_generation_api.py`: Update the data transformation

## 🔍 Troubleshooting

### API Not Starting
1. **Check Python**: Ensure Python 3 is installed
2. **Check Dependencies**: Run `pip3 install -r api_requirements.txt`
3. **Check Ollama**: Ensure Ollama is running (`ollama serve`)

### Plan Generation Fails
1. **Check API**: Ensure API is running on port 5000
2. **Check Model**: Ensure the model is downloaded (`ollama pull llama3.2:1b`)
3. **Check Logs**: Look at API server logs for error messages

### Frontend Issues
1. **Check CORS**: Ensure the API allows requests from localhost:3001
2. **Check Network**: Open browser DevTools to see network requests
3. **Check Console**: Look for JavaScript errors

## 📁 File Structure

```
emplan-web-vite/
├── src/
│   ├── EnhancedPlanForm.jsx    # Main form component
│   ├── PlanViewer.jsx          # Plan display component
│   ├── Dashboard.jsx           # Dashboard with plan management
│   └── CustomAuth.jsx          # Authentication component
├── plan_generation_api.py      # Flask API server
├── api_requirements.txt        # Python dependencies
├── start_api.sh               # API startup script
└── PLAN_GENERATION_README.md   # This file
```

## 🎯 Next Steps

1. **Add More Form Fields**: Building size, security details, medical staff
2. **Improve Model**: Use larger models for better quality
3. **Add Templates**: Pre-built templates for common organization types
4. **Add Collaboration**: Multiple users working on the same plan
5. **Add Versioning**: Track changes and revisions to plans

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Look at the API server logs
3. Check browser console for frontend errors
4. Verify all services are running (Ollama, API, Frontend) 