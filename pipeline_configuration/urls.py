from django.contrib import admin
from django.urls import include, path
from . import views

urlpatterns = [
    path('update_job_status/<str:job_id>/', views.ExecutionRecordUpdateStatusView.as_view()),
]