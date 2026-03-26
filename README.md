
AI MARKET TREND ANALYZER

Overview
AI Market Trend Analyzer is a powerful, data-driven analytics platform designed to transform raw datasets into meaningful insights. It enables users to upload data, uncover hidden patterns, and generate accurate future predictions using advanced machine learning techniques.

The platform combines statistical analysis, time-series forecasting, and AI-powered insights to help users make smarter, data-backed decisions with ease.

Key Features
- Secure user authentication (Login & Signup)
- Upload datasets (CSV / Excel)
- Automated data analysis
- Time-series forecasting using Prophet
- Visualization of historical and future trends
- AI-generated insights after analysis
- Downloadable PDF reports with charts and summaries
- Responsive dashboard UI

Tech Stack

Frontend
- React.js
- Framer Motion
- Recharts
- Axios

Backend
- Django
- Django REST Framework
- Prophet
- Pandas
- NumPy

Reporting
- ReportLab
- Matplotlib

Project Structure

frontend/
  src/
    components/
    pages/
    services/

backend/
  api/
    views.py
    models.py
    urls.py

Installation Guide

Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

Frontend Setup
cd frontend
npm install
npm start

How to Use
1. Open the frontend application
2. Sign up and log in
3. Upload a dataset (CSV or Excel)
4. Navigate to:
   - Dashboard for forecasting
   - Analysis for statistical insights
   - Reports for detailed reports and downloads
5. Generate forecasts and download reports

Dataset Requirements
- Must contain a Date column
- Must contain a numeric column such as Sales quantity, Close price, or Output

Output Generated
- Statistical metrics (Mean, Median, Standard Deviation)
- Trend analysis
- Outlier detection
- Forecast charts (past and future)
- AI-generated insights
- PDF report with complete analysis

Future Improvements
- Confidence interval visualization
- Anomaly detection
- Feature importance analysis
- Real-time data integration
- Deployment on cloud platforms

Author
Shivprasad Bembulge

