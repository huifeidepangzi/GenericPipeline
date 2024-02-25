from django.contrib import admin

from django.contrib import admin
from pipeline_configuration.models import Workflow, Version, PipelineRun, PipelineYaml


@admin.register(Workflow)
class WorkflowAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(Version)
class VersionAdmin(admin.ModelAdmin):
    list_display = ("number",)


@admin.register(PipelineYaml)
class PipelineYamlAdmin(admin.ModelAdmin):
    list_display = ("name", "description")


@admin.register(PipelineRun)
class PipelineRunAdmin(admin.ModelAdmin):
    list_display = ("pipeline_yaml", "version", "workflow")

