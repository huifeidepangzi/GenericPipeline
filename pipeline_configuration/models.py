from enum import Enum
from django.db import models
from django.contrib.auth.models import User

class Workflow(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.name


class Version(models.Model):
    number = models.PositiveIntegerField(unique=True)
    description = models.CharField(max_length=200, blank=True)

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
    pipeline_yaml = models.ManyToManyField(PipelineYaml, related_name="specyamls", default=None, blank=True)
    body = models.TextField(blank=False, null=False)
    document_link = models.URLField(null=True, blank=True, default="")
    document = models.FileField(null=True, blank=True, default=None)

    def __str__(self):
        return self.name


class PipelineRun(models.Model):
    pipeline_yaml = models.ForeignKey(
        PipelineYaml, null=False, on_delete=models.CASCADE
    )
    version = models.ForeignKey(Version, null=False, on_delete=models.CASCADE)
    workflow = models.ForeignKey(Workflow, null=False, on_delete=models.CASCADE)

    def __str__(self):
        return f"Run for workflow[{self.workflow}] and version[{self.version}]"


class PipelineExecutionRecord(models.Model):
    class PipelineExecutionStatus(models.TextChoices):
        PENDING = "PENDING", "PENDING"
        TRIGGERED = "TRIGGERED", "TRIGGERED"
        COMPLETED = "COMPLETED", "COMPLETED"
        FAILED = "FAILED", "FAILED"
        ERROR = "ERROR", "ERROR"

    triggered_at = models.DateTimeField(auto_now=True)
    finished_at = models.DateTimeField(null=True, blank=True, default=None)
    status = models.CharField(
        max_length=255,
        choices=PipelineExecutionStatus.choices,
        default=PipelineExecutionStatus.COMPLETED,
    )
    pipeline_run = models.ForeignKey(
        PipelineRun, null=True, blank=False, on_delete=models.SET_NULL
    )
    pipeline_yaml = models.ForeignKey(
        PipelineYaml, null=True, blank=False, on_delete=models.SET_NULL
    )
    # logs = models.FileField(null=True, default=None)
    job_id = models.CharField(unique=True, blank=False, null=False, max_length=100)
    link = models.URLField(null=True, blank=True, default="")

    def __str__(self):
        return str(self.pipeline_yaml.name + " triggered at " + str(self.triggered_at))


class SecretToken(models.Model):
    name = models.CharField(max_length=100, blank=False, null=False, unique=True)
    token = models.CharField(max_length=200, blank=False, null=False, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.token
    
    
class PipelineYamlHistory(models.Model):
    name = models.CharField(max_length=50, unique=True, blank=False, null=False)
    description = models.CharField(max_length=200, blank=True)
    body = models.TextField(blank=False, null=False)
    changed_at = models.DateTimeField(auto_now=True)
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)