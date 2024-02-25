from enum import Enum
from django.db import models


class Workflow(models.Model):
    name = models.CharField(max_length=50, unique=True)
    
    def __str__(self):
        return self.name
    
    
class Version(models.Model):
    number = models.PositiveIntegerField(unique=True)
    
    def __str__(self):
        return str(self.number)
    
 
class PipelineYaml(models.Model):
    name = models.CharField(max_length=50, unique=True, blank=False, null=False)
    description = models.CharField(max_length=200, blank=True)
    body = models.TextField(blank=False, null=False)
    
    def __str__(self):
        return self.name


class SpecYaml(models.Model):
    name = models.CharField(max_length=50, unique=True, blank=False, null=False)
    description = models.CharField(max_length=200, blank=True)
    pipeline_yaml = models.ManyToManyField(PipelineYaml, related_name='specyamls')
    body = models.TextField(blank=False, null=False)
    
    def __str__(self):
        return self.name


class PipelineRun(models.Model):
    pipeline_yaml = models.ForeignKey(PipelineYaml, null=False, on_delete=models.CASCADE)
    version = models.ForeignKey(Version, null=False, on_delete=models.CASCADE)
    workflow = models.ForeignKey(Workflow, null=False, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"Run for workflow[{self.workflow}] and version[{self.version}]"


class PipelineExecutionRecord(models.Model):
    class PipelineExecutionStatus(models.TextChoices):
        PENDING = "PENDING", "PENDING"
        COMPLETED = "COMPLETED", "COMPLETED"
        FAILED = "FAILED", "FAILED"
        ERROR = "ERROR", "ERROR"
        
    triggered_at = models.DateTimeField(auto_now=True)
    finished_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=255, choices=PipelineExecutionStatus.choices, default=PipelineExecutionStatus.COMPLETED)
    pipeline_run = models.ForeignKey(PipelineRun, null=True, blank=False, on_delete=models.SET_NULL)
    pipeline_yaml = models.ForeignKey(PipelineYaml, null=True, blank=False, on_delete=models.SET_NULL)
    logs = models.FileField(null=True)
    
    def __str__(self):
        return str(self.pipeline_yaml.name + " triggered at " + str(self.triggered_at))