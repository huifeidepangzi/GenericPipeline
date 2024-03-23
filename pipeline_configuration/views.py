from datetime import datetime
from typing import List
from rest_framework import generics
import yaml
from pipeline_configuration.models import PipelineExecutionRecord, PipelineYaml
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response

from pipeline_configuration.serializers import PipelineExecutionRecordSerializer
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class DragAndDropView(APIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = "drag_and_drop.html"

    def get(self, request):
        first_pipeline_yaml = PipelineYaml.objects.all().first()
        spec_details = []
        
        for spec_yaml in first_pipeline_yaml.specyamls.all():
            spec_details.append({
                "name": spec_yaml.name,
                "description": spec_yaml.description,
                "doc_link": spec_yaml.document_link,
            })
            
        return Response({"spec_details": spec_details})
        # pipeline_yaml_body = yaml.safe_load(PipelineYaml.objects.all().first().body)
        # return Response({"spec_names": [stage["spec"] for stage in pipeline_yaml_body["stages"]]})
    
    def post(self, request):
        print("111111111111111111111")
        print(request.POST)
        spec_names = request.data.get("spec_names")
        latest_id = int(PipelineYaml.objects.all().last().id)
        yaml_body_dict = {
            "name": f"pipeline yaml {latest_id+1}", 
            "stages": [{
                "desc": "fake description",
                "tags": "fake tag",
                "spec": name,
            } for name in spec_names
        ]}
        PipelineYaml.objects.create(
            name=f"pipeline yaml {latest_id+1}",
            description="fake description",
            body=yaml.dump(yaml_body_dict, indent=4, sort_keys=False)
        )
        return Response({'message': 'POST request received'}, status=status.HTTP_200_OK)
    # def get(self, request, pk):
    #     profile = get_object_or_404(Profile, pk=pk)
    #     serializer = ProfileSerializer(profile)
    #     return Response({'serializer': serializer, 'profile': profile})


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
