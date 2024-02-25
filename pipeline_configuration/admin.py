from django.contrib import admin
from django.contrib import messages
from django.contrib import admin
from pipeline_configuration.forms import PipelineYamlForm, SpecYamlForm
from pipeline_configuration.models import (
    PipelineExecutionRecord,
    Workflow,
    Version,
    PipelineRun,
    PipelineYaml,
    SpecYaml,
)


@admin.register(Workflow)
class WorkflowAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(Version)
class VersionAdmin(admin.ModelAdmin):
    list_display = ("number",)


# class YamlBodyField(forms.ModelForm):
#     class Meta:
#         model = PipelineYaml
#         widgets = {
#             "body": django_ace.AceWidget(mode="yaml", theme="twilight"),
#         }
#         fields = "__all__"


class SpecYamlsInline(admin.StackedInline):
    model = PipelineYaml.specyamls.through
    extra = 0
    can_delete = False
    can_add = False
    verbose_name = "Spec yaml"

    def has_change_permission(self, request, obj=None):
        return False


@admin.register(PipelineYaml)
class PipelineYamlAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    form = PipelineYamlForm
    fields = ["name", "description", "body"]
    inlines = [
        SpecYamlsInline,
    ]
    actions = [
        "validate_input_output_matching",
        "validate_models_loading_by_name",
        "run_pipeline",
    ]

    @admin.action(description="Validate modules input and output matching")
    def validate_input_output_matching(self, request, queryset):
        self.message_user(
            request,
            "All later inputs can be satified by earlier outputs successfully.",
            messages.SUCCESS,
        )

    @admin.action(description="Validate all models can be loaded by name.")
    def validate_models_loading_by_name(self, request, queryset):
        self.message_user(
            request,
            "All models can be loaded by name successfully.",
            messages.SUCCESS,
        )


@admin.register(SpecYaml)
class SpecYamlAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    form = SpecYamlForm


@admin.register(PipelineRun)
class PipelineRunAdmin(admin.ModelAdmin):
    list_display = ("pipeline_yaml", "version", "workflow")
    actions = ["run_pipeline"]

    @admin.action(description="Run pipeline")
    def run_pipeline(self, request, queryset):
        for pipeline_run in queryset:
            PipelineExecutionRecord.objects.create(
                status="COMPLETED",
                pipeline_yaml=pipeline_run.pipeline_yaml,
                pipeline_run=pipeline_run,
            )
            self.message_user(
                request,
                "Pipeline has been executed successfully.",
                messages.SUCCESS,
            )


@admin.register(PipelineExecutionRecord)
class PipelineExecutionRecordAdmin(admin.ModelAdmin):
    list_display = ("triggered_at", "finished_at", "status")
    fields = ("triggered_at", "finished_at", "status", "pipeline_run", "pipeline_yaml")
    readonly_fields = ("triggered_at", "finished_at")
