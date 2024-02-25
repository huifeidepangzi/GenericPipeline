from django.db import models

class Workflow(models.Model):
    name = models.CharField(max_length=50, unique=True)
    
    
class Version(models.Model):
    number = models.PositiveIntegerField(unique=True)
    
    
class PipelineYaml(models.Model):
    name = models.CharField(max_length=50, unique=True, blank=False, null=False)
    description = models.CharField(max_length=200, blank=True)
    body = models.TextField(blank=False, null=False)
    

class PipelineRun(models.Model):
    pipeline_yaml = models.ForeignKey(PipelineYaml, null=False, on_delete=models.CASCADE)
    version = models.ForeignKey(Version, null=False, on_delete=models.CASCADE)
    workflow = models.ForeignKey(Workflow, null=False, on_delete=models.CASCADE)