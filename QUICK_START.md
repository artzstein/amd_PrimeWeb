# 🎯 QUICK REFERENCE

## ⚡ The 60-Second Start

### Windows
```
1. Double-click: setup.bat
2. Open 3 terminals:
   - Terminal 1: cd backend && npm run dev
   - Terminal 2: cd frontend && npm start
   - Terminal 3: cd ml-service && venv\Scripts\activate && python app.py
3. Visit: http://localhost:3000
```

### Mac/Linux
```bash
# Terminal 1
cd backend && npm install && npm run dev

# Terminal 2
cd frontend && npm install && npm start

# Terminal 3
cd ml-service && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && python app.py
```

---

## 🌐 Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | User Interface |
| Backend | http://localhost:3001 | API Server |
| ML Service | http://localhost:5000 | Predictions |
| MongoDB | localhost:27017 | User Data |
| PostgreSQL | localhost:5432 | SQL Data |

---

## 📚 Main Features

✅ **User Auth** - Register & Login
✅ **Data Upload** - CSV/Excel import
✅ **Dashboards** - Create & customize
✅ **Visualizations** - 6+ chart types
✅ **Forecasting** - Time-series prediction
✅ **Anomalies** - Outlier detection
✅ **Insights** - AI analysis
✅ **PDF Export** - Reports

---

## 🧪 Quick Test

```
1. Register: test@example.com / password123
2. Upload: test CSV file from RUN_GUIDE.md
3. Analytics: Click Forecast, then Anomalies, then Insights
4. Dashboard Builder: Create visualization
```

---

## 📁 Project Files

```
analytics-platform/
  ├── backend/           (Express API + Models)
  ├── frontend/          (React + Material-UI)
  ├── ml-service/        (Python Flask + ML)
  ├── docker-compose.yml (Docker setup)
  ├── setup.bat          (Windows installer)
  ├── RUN_GUIDE.md       (This guide)
  └── Docker files       (For containerization)
```

---

## 🚨 Ports

- **3000** = Frontend
- **3001** = Backend API
- **5000** = ML Service
- **27017** = MongoDB
- **5432** = PostgreSQL

If ports are busy, change them in package.json / app.py

---

## 🔑 Test Account

```
Email: test@example.com
Password: password123
```

Or register any new account.

---

## ✅ Health Checks

```bash
# Frontend
curl http://localhost:3000

# Backend
curl http://localhost:3001/health

# ML Service
curl http://localhost:5000/health

# Databases (Docker only)
curl http://localhost:27017
curl http://localhost:5432
```

---

## 📖 Documentation

- **RUN_GUIDE.md** - Complete setup & features
- **README.md** - Architecture & API docs
- **SETUP.md** - Detailed instructions
- **GETTING_STARTED.md** - Walkthroughs
- **BUILD_SUMMARY.md** - What was created

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| Port already in use | Kill process using that port |
| npm install fails | Delete node_modules & reinstall |
| Python venv fails | Use: python -m venv venv |
| Can't connect to ML | Check if Python service is running |
| Can't login | Check backend console for errors |

---

**Everything is ready! Start the services and visit http://localhost:3000** 🚀
