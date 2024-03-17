from rest_framework import serializers
from .models import PipelineExecutionRecord

class PipelineExecutionRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = PipelineExecutionRecord
        fields = '__all__'