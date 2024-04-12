from django.contrib import admin
from django.urls import include, path
from . import views

urlpatterns = [
    path("add_pipeline/", views.AddPipelineView.as_view()),
    path("generate_yaml_preview/", views.GetYAMLPreviewView.as_view()),
    path(
        "update_job_status/<str:job_id>/",
        views.ExecutionRecordUpdateStatusView.as_view(),
    ),
]
