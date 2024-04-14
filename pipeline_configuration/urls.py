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
    path("edit_pipelines/", views.EditPipelineTemplateView.as_view()),
    path("edit_single_pipeline/<str:pipeline_name>/", views.EditPipelineView.as_view()),
]
