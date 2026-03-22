import pandas as pd
import numpy as np

from prophet import Prophet

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse

from reportlab.platypus import SimpleDocTemplate, Paragraph, Image, Spacer
from reportlab.lib.styles import getSampleStyleSheet


def read_file(file):
    try:
        if file.name.endswith('.csv'):
            try:
                return pd.read_csv(file, encoding='utf-8')
            except:
                return pd.read_csv(file, encoding='latin1')
        else:
            return pd.read_excel(file)
    except Exception as e:
        raise Exception(f"File read error: {str(e)}")


def get_target_column(df):
    if 'Sales quantity' in df.columns:
        return 'Sales quantity'
    elif 'Close' in df.columns:
        return 'Close'
    return None


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_dataset(request):
    file = request.FILES.get('file')

    if not file:
        return Response({"error": "No file provided"}, status=400)

    try:
        df = read_file(file)

        return Response({
            "rows": int(len(df)),
            "columns": list(df.columns)
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def forecast(request):
    file = request.FILES.get('file')

    if not file:
        return Response({"error": "No file provided"}, status=400)

    try:
        df = read_file(file)

        if 'Date' not in df.columns:
            return Response({"error": "Missing Date column"}, status=400)

        target = get_target_column(df)

        if not target:
            return Response({
                "error": "Need 'Sales quantity' or 'Close' column"
            }, status=400)

        df = df[['Date', target]].copy()

        df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
        df[target] = pd.to_numeric(df[target], errors='coerce')

        df = df.dropna()
        df = df.sort_values('Date')
        df = df.drop_duplicates(subset='Date')

        if len(df) < 10:
            return Response({"error": "Not enough data"}, status=400)

        df.columns = ['ds', 'y']

        model = Prophet(daily_seasonality=True)
        model.fit(df)

        future = model.make_future_dataframe(periods=30)
        forecast = model.predict(future)

        result = forecast[['ds', 'yhat']].tail(30)

        return Response(result.to_dict(orient="records"))

    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_dataset(request):
    file = request.FILES.get('file')

    if not file:
        return Response({"error": "No file provided"}, status=400)

    try:
        df = read_file(file)

        df = df.replace([np.inf, -np.inf], np.nan)
        df = df.dropna()

        numeric_cols = df.select_dtypes(include=np.number).columns

        stats = {
            col: {
                "mean": float(df[col].mean()),
                "median": float(df[col].median()),
                "variance": float(df[col].var())
            }
            for col in numeric_cols
        }

        insights = []

        target = get_target_column(df)

        if target:
            avg = df[target].mean()

            insights.append(f"Average: {avg:.2f}")

            if avg > df[target].median():
                insights.append("Uptrend 📈")
            else:
                insights.append("Volatile 📉")

        return Response({
            "stats": stats,
            "ai_insights": insights
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['POST'])
def generate_report(request):
    file = request.FILES.get('file')

    if not file:
        return Response({"error": "No file provided"}, status=400)

    try:
        df = read_file(file)

        target = get_target_column(df)

        if not target or 'Date' not in df.columns:
            return Response({"error": "Invalid dataset"}, status=400)

        df = df[['Date', target]].copy()
        df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
        df[target] = pd.to_numeric(df[target], errors='coerce')

        df = df.dropna()

        df.columns = ['ds', 'y']

        model = Prophet(daily_seasonality=True)
        model.fit(df)

        future = model.make_future_dataframe(periods=30)
        forecast = model.predict(future)

        result = forecast[['ds', 'yhat']].tail(30)

        import matplotlib.pyplot as plt

        plt.figure(figsize=(6, 3))
        plt.plot(result['ds'], result['yhat'], color='blue')
        plt.title("Forecast")
        plt.xticks(rotation=45)

        chart_path = "forecast.png"
        plt.savefig(chart_path)
        plt.close()

        avg = df['y'].mean()
        median = df['y'].median()
        max_val = df['y'].max()
        min_val = df['y'].min()
        std = df['y'].std()

        insights = []

        if avg > median:
            insights.append("Overall upward trend observed 📈")
        else:
            insights.append("Market shows volatility 📉")

        if std > avg * 0.3:
            insights.append("High volatility detected ⚠️")
        else:
            insights.append("Stable trend observed ✅")

        insights.append(f"Peak value reached: {max_val}")
        insights.append(f"Lowest value observed: {min_val}")

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename=\"report.pdf\"'

        doc = SimpleDocTemplate(response)
        styles = getSampleStyleSheet()

        content = []

        content.append(Paragraph("AI Market Analysis Report", styles['Title']))
        content.append(Spacer(1, 10))

        content.append(Paragraph(f"Total Rows: {len(df)}", styles['Normal']))
        content.append(Paragraph(f"Average: {avg:.2f}", styles['Normal']))
        content.append(Paragraph(f"Median: {median:.2f}", styles['Normal']))
        content.append(Paragraph(f"Max: {max_val}", styles['Normal']))
        content.append(Paragraph(f"Min: {min_val}", styles['Normal']))
        content.append(Paragraph(f"Std Deviation: {std:.2f}", styles['Normal']))

        content.append(Spacer(1, 15))

        content.append(Paragraph("AI Insights", styles['Heading2']))
        content.append(Spacer(1, 10))

        for insight in insights:
            content.append(Paragraph(f"• {insight}", styles['Normal']))

        content.append(Spacer(1, 20))

        content.append(Paragraph("Forecast Chart", styles['Heading2']))
        content.append(Spacer(1, 10))
        content.append(Image(chart_path, width=400, height=200))

        doc.build(content)

        return response

    except Exception as e:
        return Response({"error": str(e)}, status=500)