import pandas as pd
import numpy as np
import random
import matplotlib.pyplot as plt
import tempfile
from prophet import Prophet
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from reportlab.platypus import SimpleDocTemplate, Paragraph, Image, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from django.contrib.auth.models import User
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken
from .models import OTP


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

    df = read_file(file)

    return Response({
        "rows": int(len(df)),
        "columns": list(df.columns)
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def forecast(request):
    try:
        file = request.FILES.get('file')

        if not file:
            return Response({"error": "No file provided"}, status=400)

        df = read_file(file)

        if 'Date' not in df.columns:
            return Response({"error": "Missing Date column"}, status=400)

        target = get_target_column(df)

        if not target:
            return Response({"error": "Need 'Sales quantity' or 'Close'"}, status=400)

        df = df[['Date', target]].copy()
        df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
        df[target] = pd.to_numeric(df[target], errors='coerce')
        df = df.dropna().sort_values('Date')
        df = df.tail(300)

        if len(df) < 10:
            return Response({"error": "Not enough data"}, status=400)

        df.columns = ['ds', 'y']

        model = Prophet()
        model.fit(df)

        future = model.make_future_dataframe(periods=365*5)
        forecast = model.predict(future)
        
        result = forecast[['ds', 'yhat']]
        past = result.iloc[-365:-1]
        future_data = result.iloc[-365*5:]

        return Response({
            "past": past.to_dict(orient="records"),
            "future": future_data.to_dict(orient="records"),
            "analysis": "Forecast generated successfully."
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_dataset(request):
    file = request.FILES.get('file')

    if not file:
        return Response({"error": "No file provided"}, status=400)

    df = read_file(file)
    df = df.replace([np.inf, -np.inf], np.nan)
    df = df.dropna()

    numeric_cols = df.select_dtypes(include=np.number).columns

    if len(numeric_cols) == 0:
        return Response({"error": "No numeric data found"}, status=400)

    col = numeric_cols[0]

    mean = df[col].mean()
    median = df[col].median()
    std = df[col].std()

    trend = "increasing" if df[col].iloc[-1] > df[col].iloc[0] else "decreasing"

    outliers = df[(df[col] > mean + 2 * std) | (df[col] < mean - 2 * std)].shape[0]
    missing = df.isnull().sum().sum()

    insight = f"The dataset shows a {trend} trend. Average value is {round(mean,2)}."

    series = []
    for i, row in df.head(100).iterrows():
        series.append({
            "ds": str(i),
            "y": float(row[col])
        })

    return Response({
        "mean": round(mean, 2),
        "median": round(median, 2),
        "std": round(std, 2),
        "trend": trend,
        "outliers": int(outliers),
        "missing": int(missing),
        "insight": insight,
        "series": series
    })


@api_view(['POST'])
def send_otp(request):
    username = request.data.get("username")

    user = User.objects.filter(username=username).first()

    if not user:
        return Response({"error": "User not found"}, status=400)

    OTP.objects.filter(user=user).delete()

    code = str(random.randint(100000, 999999))
    OTP.objects.create(user=user, code=code)

    send_mail(
        'OTP Verification',
        f'Your OTP is {code}',
        'no-reply@gmail.com',
        [user.email],
        fail_silently=True,
    )

    print("OTP:", code)

    return Response({"message": "OTP sent"})


@api_view(['POST'])
def verify_otp(request):
    username = request.data.get("username")
    code = request.data.get("otp")

    user = User.objects.filter(username=username).first()

    if not user:
        return Response({"error": "User not found"}, status=400)

    otp_obj = OTP.objects.filter(user=user, code=code, is_verified=False).last()

    if not otp_obj:
        return Response({"error": "Invalid OTP"}, status=400)

    otp_obj.is_verified = True
    otp_obj.save()

    refresh = RefreshToken.for_user(user)

    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh)
    })


@api_view(['POST'])
def signup(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    if User.objects.filter(username=username).exists():
        return Response({"error": "User already exists"}, status=400)

    user = User.objects.create_user(
        username=username,
        password=password,
        email=email
    )

    code = str(random.randint(100000, 999999))
    OTP.objects.create(user=user, code=code)

    send_mail(
        'OTP Verification',
        f'Your OTP is {code}',
        'no-reply@gmail.com',
        [email],
        fail_silently=True,
    )

    print("OTP:", code)

    return Response({"message": "User created. OTP sent"})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_report(request):
    file = request.FILES.get('file')

    if not file:
        return Response({"error": "No file provided"}, status=400)

    df = read_file(file)
    df = df.replace([np.inf, -np.inf], np.nan)
    df = df.dropna()

    numeric_cols = df.select_dtypes(include=np.number).columns

    if len(numeric_cols) == 0:
        return Response({"error": "No numeric data"}, status=400)

    col = numeric_cols[0]

    rows = len(df)
    mean = df[col].mean()
    median = df[col].median()
    std = df[col].std()

    past = []
    future_data = []

    if 'Date' in df.columns:
        df2 = df[['Date', col]].copy()
        df2.columns = ['ds', 'y']
        df2['ds'] = pd.to_datetime(df2['ds'])

        model = Prophet()
        model.fit(df2)

        future = model.make_future_dataframe(periods=365*5)
        forecast = model.predict(future)
        
        past = forecast[['ds', 'yhat']].iloc[:-365*5]
        future_data = forecast[['ds', 'yhat']].iloc[-365*5:]

    plt.figure(figsize=(6, 3))
    if len(past) > 0:
        plt.plot(past['ds'], past['yhat'])
        plt.title("Past Analysis")
        ticks = past['ds'][::max(1, len(past)//5)]
        plt.xticks(ticks=ticks, labels=[d.strftime('%Y') for d in ticks], rotation=0)
    plt.tight_layout()
    past_img = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
    plt.savefig(past_img.name)
    plt.close()

    plt.figure(figsize=(6, 3))
    if len(future_data) > 0:
       temp = future_data.copy()
       temp['year'] = temp['ds'].dt.year

       yearly = temp.groupby('year').mean().reset_index()
       yearly['ds'] = pd.to_datetime(yearly['year'], format='%Y')
       
       plt.plot(yearly['ds'], yearly['yhat'])
       plt.title("Future Forecast")
       
       plt.xticks(
    ticks=yearly['ds'],
    labels=[str(y) for y in yearly['year']],
    rotation=0
) 
    plt.tight_layout()
    future_img = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
    plt.savefig(future_img.name)
    plt.close()

    plt.figure(figsize=(4, 4))
    plt.bar(["Mean", "Median", "Std"], [mean, median, std])
    plt.title("AI Insights")
    insight_img = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
    plt.savefig(insight_img.name)
    plt.close()

    trend = "increasing" if df[col].iloc[-1] > df[col].iloc[0] else "decreasing"

    analysis = f"""
    The dataset shows a {trend} trend.
    Average value is {round(mean,2)}.
    Median is {round(median,2)}.
    Standard deviation is {round(std,2)}.
    """

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="report.pdf"'

    doc = SimpleDocTemplate(response)
    styles = getSampleStyleSheet()

    content = []

    content.append(Paragraph("AI Market Trend Report", styles['Title']))
    content.append(Spacer(1, 12))
    content.append(Paragraph(f"File Name: {file.name}", styles['Normal']))
    content.append(Paragraph(f"Total Rows: {rows}", styles['Normal']))
    content.append(Spacer(1, 12))

    content.append(Paragraph("Statistical Analysis", styles['Heading2']))
    content.append(Paragraph(f"Mean: {round(mean,2)}", styles['Normal']))
    content.append(Paragraph(f"Median: {round(median,2)}", styles['Normal']))
    content.append(Paragraph(f"Std Dev: {round(std,2)}", styles['Normal']))
    content.append(Spacer(1, 12))

    content.append(Paragraph("Past Analysis Chart", styles['Heading2']))
    content.append(Image(past_img.name, width=400, height=200))
    content.append(Spacer(1, 12))

    content.append(Paragraph("Future Forecast Chart", styles['Heading2']))
    content.append(Image(future_img.name, width=400, height=200))
    content.append(Spacer(1, 12))

    content.append(Paragraph("AI Insights Chart", styles['Heading2']))
    content.append(Image(insight_img.name, width=300, height=200))
    content.append(Spacer(1, 12))

    content.append(Paragraph("AI Post Analysis", styles['Heading2']))
    content.append(Paragraph(analysis, styles['Normal']))

    doc.build(content)

    return response