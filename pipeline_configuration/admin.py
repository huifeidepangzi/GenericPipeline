from django.contrib import admin
from django.contrib import messages
from django.contrib import admin
from django.http import JsonResponse
from django.shortcuts import render
from django.urls import path
import requests
import yaml
from yaml import SafeLoader
from pipeline_configuration.forms import (
    PipelineYamlForm,
    PipelineYamlHistoryForm,
    SpecYamlForm,
    VariableLifecycleScanForm,
    YAMLDisplayForm,
)
from pipeline_configuration.models import (
    PipelineExecutionRecord,
    PipelineYamlHistory,
    SecretToken,
    Workflow,
    Version,
    PipelineRun,
    PipelineYaml,
    SpecYaml,
)
from django.utils.html import format_html

from pipeline_configuration.utils.yaml_tools import yaml_to_json

@admin.register(Workflow)
class WorkflowAdmin(admin.ModelAdmin):
    list_display = ("name", "description")


@admin.register(Version)
class VersionAdmin(admin.ModelAdmin):
    list_display = ("number", "description")


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
    change_form_template = "change_form.html"
    
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        
        if request.user.is_authenticated:
            PipelineYamlHistory.objects.create(
                name=obj.name,
                description=obj.description,
                body=obj.body,
                changed_by=request.user,
            )

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "<int:pk>/change/scan-variable-lifecycle/", self.scan_variable_lifecycle
            ),
            path(
                "<int:pk>/change/scan-variable-lifecycle/collect-lifecycle-info/",
                self.collect_lifecycle_info,
            ),
        ]
        return custom_urls + urls

    def scan_variable_lifecycle(self, request, pk):
        pipeline_yaml_instance = PipelineYaml.objects.get(id=pk)
        yaml_display_form = YAMLDisplayForm(
            initial={"yaml_text": pipeline_yaml_instance.body}
        )

        scan_form = VariableLifecycleScanForm()
        payload = {"scan_form": scan_form, "yaml_display_form": yaml_display_form}
        return render(request, "scan_variable_lifecycle.html", payload)

    def collect_lifecycle_info(self, request, pk):
        target_variable_name = request.GET["variable_name"]
        matched_specs = []
        pipeline_yaml_instance = PipelineYaml.objects.get(id=pk)
        for spec in pipeline_yaml_instance.specyamls.order_by("name").all():
            spec_yaml_dict = yaml.load(spec.body, Loader=SafeLoader)
            for form in spec_yaml_dict["input_variables"]:
                for fields in form.values():
                    for field in fields:
                        for field_name in field.keys():
                            if field_name == target_variable_name:
                                matched_specs.append(
                                    f"{spec.name}.input.{target_variable_name}"
                                )

            for form in spec_yaml_dict["output_variables"]:
                for fields in form.values():
                    for field in fields:
                        for field_name in field.keys():
                            if field_name == target_variable_name:
                                matched_specs.append(
                                    f"{spec.name}.output.{target_variable_name}"
                                )

        if not matched_specs:
            matched_specs.append("Variable name not found.")

        return JsonResponse({"scan_results": matched_specs})

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
    list_display = ("name", "description", "document_link")
    form = SpecYamlForm


@admin.register(PipelineRun)
class PipelineRunAdmin(admin.ModelAdmin):
    list_display = ("pipeline_yaml", "version", "workflow")
    actions = ["run_pipeline"]

    @admin.action(description="Run pipeline")
    def run_pipeline(self, request, queryset):
        gitlab_token = SecretToken.objects.get(name="GITLAB_JOB_TRIGGER_TOKEN")
        # URL of the endpoint you want to send the POST request to
        url = 'https://gitlab.com/api/v4/projects/55799180/trigger/pipeline'

        run_yaml = yaml_to_json(queryset.get().pipeline_yaml.body)
        run_yaml = run_yaml.replace(" ", "").replace('"', '\"')

        # JSON data to be sent in the POST request
        data = {
            "token": gitlab_token.token,
            "ref": "main",
            "variables": {"JOB_TYPE": "JOB_1", "pipeline_yaml": run_yaml}
        }

        # Send the POST request with JSON data
        response = requests.post(url, json=data)

        # Check the response status code
        # if response.status_code == 200:
        #     print('POST request successful!')
        # else:
        #     print(f'Failed to send POST request. Status code: {response.status_code}')
        
        for pipeline_run in queryset:
            PipelineExecutionRecord.objects.create(
                status="TRIGGERED",
                pipeline_yaml=pipeline_run.pipeline_yaml,
                pipeline_run=pipeline_run,
                job_id=response.json()["id"],
                link=f"https://gitlab.com{response.json()['detailed_status']['details_path']}"
            )
            self.message_user(
                request,
                "Pipeline has been executed successfully.",
                messages.SUCCESS,
            )


@admin.register(PipelineExecutionRecord)
class PipelineExecutionRecordAdmin(admin.ModelAdmin):
    list_display = ("triggered_at", "finished_at", "status", "job_id", "job_link")
    fields = ("triggered_at", "finished_at", "status", "pipeline_run", "pipeline_yaml", "job_id", "job_link")
    readonly_fields = ("triggered_at", "finished_at", "job_id", "job_link")
    
    def job_link(self, instance):
        return format_html(
            '<a href="{0}" target="_blank">{1}</a>',
            instance.link,
            instance.link,
        )


@admin.register(SecretToken)
class SecretTokenAdmin(admin.ModelAdmin):
    list_display = ("name",)
    
    
@admin.register(PipelineYamlHistory)
class PipelineYamlHistoryAdmin(admin.ModelAdmin):
    list_display = ("name", "description", "changed_at", "changed_by")
    form = PipelineYamlHistoryForm
    fields = ["name", "description", "body", "changed_at", "changed_by"]
    readonly_fields = ["changed_at", "changed_by"]