from yaml import SafeLoader
from pipeline_configuration.models import PipelineYaml, PipelineYamlHistory, SpecYaml
from django import forms
import django_ace  # type: ignore
import yaml


class PipelineYamlForm(forms.ModelForm):
    def clean(self):
        validation_errors = []
        yaml_dict = yaml.load(self.cleaned_data["body"], Loader=SafeLoader)

        if "name" not in yaml_dict:
            validation_errors.append(
                forms.ValidationError(
                    "Logic block name field is missing.", code="MISSED_PIPELINE_NAME"
                )
            )

        if "logic_blocks" not in yaml_dict:
            validation_errors.append(
                forms.ValidationError(
                    "Logic blocks field is missing.", code="MISSED_LOGIC_BLOCKS"
                )
            )

        for logic_block_yaml in yaml_dict["logic_blocks"]:
            if "name" not in logic_block_yaml:
                validation_errors.append(
                    forms.ValidationError(
                        "Logic block name field is missing.",
                        code="MISSED_LOGIC_BLOCK_NAME",
                    )
                )

            if "stages" not in logic_block_yaml:
                validation_errors.append(
                    forms.ValidationError(
                        "stages field is missing.", code="MISSED_STAGES"
                    )
                )
            else:
                all_spec_model_names = self.instance.specyamls.all().values_list(
                    "name", flat=True
                )
                # all_spec_names_in_logic_block = [stage["spec"] for stage in logic_block_yaml["stages"]]

                # for spec_model_name in all_spec_names_in_logic_block:
                #     if spec_model_name not in all_spec_model_names:
                #         validation_errors.append(
                #             forms.ValidationError(
                #                 f"Spec {spec_model_name} is not in spec model.",
                #                 code="SPEC_MISSING_IN_SPEC_MODEL",
                #             )
                #         )

                for index, stage in enumerate(logic_block_yaml["stages"]):
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
                    # elif stage["spec"] not in all_spec_model_names:
                    #     validation_errors.append(
                    #         forms.ValidationError(
                    #             f"Spec {stage['spec']} is not linked to this pipeline yaml.",
                    #             code="SPEC_MODEL_UNLINKED",
                    #         )
                    #     )
                    # if "tags" not in stage:
                    #     validation_errors.append(
                    #         forms.ValidationError(
                    #             f"Tags field is missing in {index + 1} spec.",
                    #             code="MISSED_TAGS",
                    #         )
                    #     )

        if validation_errors:
            raise forms.ValidationError(validation_errors)

        return self.cleaned_data

    class Meta:
        model = PipelineYaml
        widgets = {
            "body": django_ace.AceWidget(mode="yaml", theme="twilight"),
        }
        fields = "__all__"


class PipelineYamlHistoryForm(forms.ModelForm):
    class Meta:
        model = PipelineYamlHistory
        widgets = {
            "body": django_ace.AceWidget(mode="yaml", theme="twilight"),
        }
        fields = "__all__"


class SpecYamlForm(forms.ModelForm):
    class Meta:
        model = SpecYaml
        widgets = {
            "body": django_ace.AceWidget(mode="yaml", theme="twilight"),
        }
        fields = "__all__"


class VariableLifecycleScanForm(forms.Form):
    variable_name = forms.CharField(min_length=1)


class YAMLDisplayForm(forms.Form):
    yaml_text = forms.CharField(
        widget=forms.Textarea(attrs={"rows": 10, "cols": 84, "readonly": "readonly"})
    )
