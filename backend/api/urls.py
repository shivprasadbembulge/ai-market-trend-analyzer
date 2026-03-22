from django.urls import path
from .views import upload_dataset, forecast, analyze_dataset, generate_report

urlpatterns = [
    path('upload/', upload_dataset),
    path('forecast/', forecast),
    path('analyze/', analyze_dataset),
    path('generate_report/', generate_report),
]