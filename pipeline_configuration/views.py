from datetime import datetime
from typing import List
from rest_framework import generics
import yaml
from pipeline_configuration.models import PipelineExecutionRecord, PipelineYaml, SpecYaml
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response

from pipeline_configuration.serializers import PipelineExecutionRecordSerializer
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class AddPipelineView(APIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = "add_pipeline.html"

    def get(self, request):
        # first_pipeline_yaml = PipelineYaml.objects.all().first()
        spec_details = []
        
        for spec_yaml in SpecYaml.objects.all().order_by("name"):
            spec_details.append({
                "name": spec_yaml.name,
                "description": spec_yaml.description,
                "doc_link": spec_yaml.document_link,
            })
            
        return Response({"spec_details": spec_details})
   
    def post(self, request):
        logic_blocks = []
        for logic_block_name, stage_names in request.data.get("logic_blocks").items():
            logic_blocks.append({
                "name": logic_block_name,
                "stages": [{
                    "desc": SpecYaml.objects.get(name=name).description,
                    "spec": SpecYaml.objects.get(name=name).name,
                } for name in stage_names],
            })
        
        yaml_body_dict = {
            "name": request.data.get("pipeline_name"), 
            "logic_blocks": logic_blocks,
        }

        new_pipeline_yaml = PipelineYaml.objects.create(
            name=request.data.get("pipeline_name"),
            description=request.data.get("pipeline_description"),
            body=yaml.dump(yaml_body_dict, indent=4, sort_keys=False),
        )
        
        spec_yamls = SpecYaml.objects.filter(
            name__in=[
                stage["spec"] for lb in logic_blocks for stage in lb["stages"]
            ]
        )
        new_pipeline_yaml.specyamls.set(spec_yamls)

        return Response({'message': 'POST request received'}, status=status.HTTP_200_OK)


class ExecutionRecordUpdateStatusView(generics.UpdateAPIView):
    queryset = PipelineExecutionRecord.objects.all()
    serializer_class = PipelineExecutionRecordSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = "job_id"  # Specify the field to use for object lookup

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        
        instance.status = serializer.validated_data["status"]
        if instance.status == "COMPLETED":
            instance.finished_at = datetime.now()
        instance.save()

        return Response(serializer.data)
