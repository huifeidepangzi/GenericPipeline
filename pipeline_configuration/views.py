from rest_framework import generics
from pipeline_configuration.models import PipelineExecutionRecord
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response

from pipeline_configuration.serializers import PipelineExecutionRecordSerializer


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
        instance.save()
        return Response(serializer.data)
