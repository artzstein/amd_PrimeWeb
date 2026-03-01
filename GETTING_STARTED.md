# Getting Started - Analytics Platform

## 🎯 What You Have

A complete, production-ready Analytics Platform with **AI-powered predictive analytics** - a sophisticated alternative to Power BI with advanced machine learning capabilities.

## ✨ Key Features Built

### Core Features
✅ **User Authentication**: Secure registration and login with JWT
✅ **Data Management**: Upload CSV/Excel files with automatic schema detection
✅ **Interactive Dashboards**: Create and manage custom dashboards with widgets
✅ **Rich Visualizations**: Multiple chart types (Bar, Line, Pie, Scatter, Heatmaps)
✅ **Real-time Analytics**: Quick data filtering and exploration
✅ **PDF Export**: Generate professional dashboard reports

### 🤖 AI-Powered Predictive Analytics (Unique Feature!)
✅ **Time-Series Forecasting**: Predict future values with confidence intervals using Prophet
✅ **Anomaly Detection**: Automatically identify unusual patterns and outliers using statistical methods
✅ **Intelligent Insights**: AI-generated insights from data analysis with statistical measures
✅ **Trend Analysis**: Automatic detection of data patterns and trends
✅ **Predictive Widgets**: Embed AI predictions directly in dashboards

## 📦 Technology Stack Implemented

- **Frontend**: React 18, Material-UI, Recharts for visualizations
- **Backend**: Node.js with Express.js, TypeScript
- **Databases**: MongoDB (metadata), PostgreSQL (SQL connections)
- **ML/AI**: Python with Prophet (forecasting), scikit-learn (anomaly detection)
- **Testing**: Jest, React Testing Library, pytest
- **DevOps**: Docker, Docker Compose

## 📁 Project Structure

```
analytics-platform/
├── backend/              # Express.js REST API
│   ├── src/controllers/  # Auth, datasets, dashboards, predictions
│   ├── src/models/       # User, Dataset, Dashboard, Prediction
│   ├── src/routes/       # API routes
│   ├── src/middleware/   # Auth, error handling, logging
│   ├── src/utils/        # PDF generation, helpers
│   ├── tests/            # Unit & integration tests
│   └── Dockerfile
│
├── frontend/            # React web application
│   ├── src/pages/       # Login, Register, Dashboard, Datasets, Analytics, Builder
│   ├── src/components/  # Navigation, Charts, Forms
│   ├── src/services/    # API client wrappers
│   ├── src/__tests__/   # React component tests
│   └── Dockerfile
│
├── ml-service/         # Python Flask ML API
│   ├── app.py         # Flask application
│   ├── models/        # forecasting.py, anomaly_detection.py, insights.py
│   ├── tests/         # ML model tests & API tests
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml   # Orchestrates all services
├── .env.example        # Configuration template
├── README.md           # Full documentation
├── SETUP.md            # Detailed setup guide
└── .gitignore
```

## 🚀 Quick Start (3 Steps)

### Option 1: Docker (Easiest)

**Step 1: Setup**
```bash
cd analytics-platform
cp .env.example .env
```

**Step 2: Start**
```bash
docker-compose up --build
```

**Step 3: Access**
- 🌐 Open http://localhost:3000
- Register a new account
- Start using the platform!

### Option 2: Local Development

All three services start independently:

**Backend** (Terminal 1)
```bash
cd backend
npm install
npm run dev  # Runs on :3001
```

**Frontend** (Terminal 2)
```bash
cd frontend
npm install
npm start    # Runs on :3000
```

**ML Service** (Terminal 3)
```bash
cd ml-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py  # Runs on :5000
```

## 🧪 Testing

### Run All Tests
```bash
# Backend
cd backend && npm test -- --coverage

# Frontend
cd frontend && npm test -- --coverage

# ML Service
cd ml-service && pytest tests/ -v --cov
```

### Manual Testing Workflow

1. **Register**
   - Go to http://localhost:3000/register
   - Create account with email and password

2. **Upload Dataset**
   - Navigate to "Datasets"
   - Click "Upload Dataset"
   - Choose a CSV/Excel file
   - Give it a name

3. **Explore Analytics**
   - Go to "Analytics" page
   - Select your dataset
   - Choose a numeric column
   - Click "Forecast", "Anomalies", or "Insights"
   - Watch AI analysis in real-time!

4. **Create Dashboard**
   - Go to "Dashboard Builder"
   - Add multiple visualization widgets
   - Change chart types
   - See live data visualization

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Datasets
- `GET /api/datasets` - List all datasets
- `POST /api/datasets/upload` - Upload CSV/Excel
- `GET /api/datasets/:id` - Get dataset details
- `GET /api/datasets/:id/data` - Get dataset data (paginated)
- `DELETE /api/datasets/:id` - Delete dataset

### Dashboards
- `GET /api/dashboards` - List all dashboards
- `POST /api/dashboards` - Create dashboard
- `GET /api/dashboards/:id` - Get dashboard
- `PUT /api/dashboards/:id` - Update dashboard
- `DELETE /api/dashboards/:id` - Delete dashboard
- `POST /api/dashboards/:id/widgets` - Add widget
- `DELETE /api/dashboards/:id/widgets/:widgetId` - Remove widget

### Predictive Analytics (ML Service Integration)
- `POST /api/predict/forecast` - Get time-series forecast
- `POST /api/predict/anomalies` - Detect anomalies
- `POST /api/predict/insights` - Generate AI insights

## 💾 Database Schemas

**Users**
```javascript
{ email, password (hashed), name, createdAt }
```

**Datasets**
```javascript
{ userId, name, type, columns, data, rowCount, createdAt }
```

**Dashboards**
```javascript
{ userId, name, widgets[], layout, createdAt }
```

**Predictions**
```javascript
{ datasetId, columnName, forecast[], anomalies[], insights[], confidence }
```

## 🎓 Example Workflows

### Workflow 1: Sales Forecasting
1. Upload monthly sales CSV
2. Go to Analytics → Select dataset → Select "sales" column
3. Click "Forecast" → See 30-day prediction with confidence bands
4. View insights about sales patterns
5. Add forecast widget to dashboard
6. Export dashboard as PDF

### Workflow 2: Anomaly Detection
1. Upload sensor data CSV
2. Go to Analytics → Select dataset → Select sensor column
3. Click "Anomalies" → View detected outliers
4. See Z-score and severity for each anomaly
5. Investigate unusual readings
6. Create alert for future anomalies

### Workflow 3: Data Insights
1. Upload any numeric dataset
2. Go to Analytics → Select dataset → Select column
3. Click "Insights" → Get AI-generated analysis
4. Learn about mean, median, variance, trends
5. Identify data patterns automatically
6. Make data-driven decisions

## 🔒 Security Features

- ✅ JWT authentication with expiration
- ✅ Password hashing with bcryptjs
- ✅ CORS configuration
- ✅ Input validation & sanitization
- ✅ Error handling without exposing stack traces
- ✅ User isolation (can only access own data)

## 📈 Performance Optimizations

- Database indexing for faster queries
- Connection pooling for databases
- Lazy loading in React components
- Code splitting and bundle optimization
- ML model caching
- Pagination for large datasets

## 🎯 Next Steps / Enhancements

Future improvements you could add:
- [ ] Real-time collaboration (WebSockets)
- [ ] More data source connectors (Salesforce, Google Sheets, etc.)
- [ ] Advanced permission management
- [ ] Scheduled reports
- [ ] Custom SQL queries in dashboards
- [ ] Mobile app
- [ ] Data warehouse integration
- [ ] Advanced ML models (LSTM, XGBoost)
- [ ] API rate limiting
- [ ] User audit logs

## 📞 Troubleshooting

**Port conflicts?**
```bash
# Find what's using a port
lsof -i :3000
# Kill it
kill -9 <PID>
```

**Docker won't start?**
```bash
# Check Docker status
docker ps
# Clean up old containers
docker-compose down -v
docker-compose up --build
```

**Tests failing?**
```bash
# Clear Jest cache
npm test -- --clearCache
# Reinstall dependencies
npm ci
```

**ML Service not responding?**
```bash
curl http://localhost:5000/health
# Check logs
docker logs analytics_ml
```

## 📚 File Reference

**Key Files to Know:**
- `backend/src/server.ts` - Express server setup
- `backend/src/models/User.ts` - User authentication
- `backend/src/controllers/predictController.ts` - ML integration
- `frontend/src/App.tsx` - Main React app
- `frontend/src/pages/Analytics.tsx` - Predictive analytics UI
- `ml-service/models/forecasting.py` - Time-series forecasting
- `ml-service/models/anomaly_detection.py` - Anomaly detection
- `docker-compose.yml` - Service configuration

## 🎉 You're Ready!

Everything is built and tested. To start:

```bash
docker-compose up --build
```

Then visit http://localhost:3000 and start building dashboards with AI-powered insights!

---

**Built with:** React • Node.js • Python • MongoDB • PostgreSQL • Prophet
**Format:** Production-ready • Fully tested • Dockerized • Scalable

Enjoy your Analytics Platform! 🚀📊
