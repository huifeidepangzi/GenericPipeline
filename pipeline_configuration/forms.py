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
        yaml_dict = yaml.load(self.cleaned_data["body"], Loader=SafeLoader)
        if yaml_dict["stages"][1]["spec"] != "ado.2":
            raise forms.ValidationError(
                f"Bad ado number: {yaml_dict['stages'][1]['spec']}"
            )
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
