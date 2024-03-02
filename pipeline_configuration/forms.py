from yaml import SafeLoader
from pipeline_configuration.models import PipelineYaml, SpecYaml
from django import forms
import django_ace  # type: ignore
import yaml


class PipelineYamlForm(forms.ModelForm):
    class Meta:
        model = PipelineYaml
        exclude = [
            id,
        ]

    def clean(self):
        validation_errors = []
        yaml_dict = yaml.load(self.cleaned_data["body"], Loader=SafeLoader)
        if "name" not in yaml_dict:
            validation_errors.append(
                forms.ValidationError("Name field is missing.", code="MISSED_NAME")
            )

        if "stages" not in yaml_dict:
            validation_errors.append(
                forms.ValidationError("Specs field is missing.", code="MISSED_SPECS")
            )
        else:
            for index, stage in enumerate(yaml_dict["stages"]):
                if "desc" not in stage:
                    validation_errors.append(
                        forms.ValidationError(
                            f"Desc field is missing in {index + 1} spec.",
                            code="MISSED_DESC",
                        )
                    )
                if "spec" not in stage:
                    validation_errors.append(
                        forms.ValidationError(
                            f"Spec field is missing in {index + 1} spec.",
                            code="MISSED_SPEC",
                        )
                    )
                if "tags" not in stage:
                    validation_errors.append(
                        forms.ValidationError(
                            f"Tags field is missing in {index + 1} spec.",
                            code="MISSED_TAGS",
                        )
                    )

        if validation_errors:
            raise forms.ValidationError(validation_errors)

        return self.cleaned_data

    class Meta:
        model = PipelineYaml
        widgets = {
            "body": django_ace.AceWidget(mode="yaml", theme="twilight"),
        }
        fields = "__all__"


class SpecYamlForm(forms.ModelForm):
    class Meta:
        model = PipelineYaml
        widgets = {
            "body": django_ace.AceWidget(mode="yaml", theme="twilight"),
        }
        fields = "__all__"
