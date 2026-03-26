AI Market Trend Analyzer
Overview
AI Market Trend Analyzer is a data-driven analytics platform that allows users to upload datasets, analyze trends, and generate future predictions using machine learning. The system provides statistical insights, forecasting, and downloadable reports to support decision-making.

Features
User authentication (login and signup)
Upload CSV or Excel datasets
Automated data analysis
Time series forecasting using Prophet
Visualization of past trends and future predictions
AI-generated insights and post-analysis
Downloadable PDF reports with charts and analysis
Responsive dashboard with modern UI
Tech Stack
Frontend
React
Framer Motion
Recharts
Axios
Backend
Django
Django REST Framework
Prophet
Pandas
NumPy
Reporting
ReportLab
Matplotlib
Project Structure
frontend/ src/ components/ pages/ services/

backend/ api/ views.py models.py urls.py


Installation
Backend Setup
cd backend python -m venv venv venv\Scripts\activate pip install -r requirements.txt python manage.py migrate python manage.py runserver

Frontend Setup
cd frontend npm install npm start

Usage
Open the frontend application

Sign up and log in

Upload a dataset (CSV or Excel)

Navigate to:

Dashboard for forecasting
Analysis for statistical insights
Reports for detailed reports and PDF download
Generate forecasts and download reports

Dataset Requirements
Must contain a Date column

Must contain a numeric column such as:

Sales quantity
Close price
Output
The system generates:

Statistical metrics (mean, median, standard deviation)
Trend analysis
Outlier detection
Forecast charts (past and future)
AI-generated insights
PDF report with complete analysis
Future Improvements
Confidence interval visualization
Anomaly detection
Feature importance analysis
Real-time data integration
Deployment on cloud platforms
Author
Shivprasad Bembulge