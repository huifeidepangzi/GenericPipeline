from django import forms
from django.contrib import admin
import django_ace

from django.contrib import admin
from pipeline_configuration.models import Workflow, Version, PipelineRun, PipelineYaml


@admin.register(Workflow)
class WorkflowAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(Version)
class VersionAdmin(admin.ModelAdmin):
    list_display = ("number",)


class YamlAdminField(forms.ModelForm):
    class Meta:
        model = PipelineYaml
        widgets = {
            "body": django_ace.AceWidget(mode="yaml", theme="twilight"),
        }
        fields = "__all__"


@admin.register(PipelineYaml)
class PipelineYamlAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    form = YamlAdminField

@admin.register(PipelineRun)
class PipelineRunAdmin(admin.ModelAdmin):
    list_display = ("pipeline_yaml", "version", "workflow")

