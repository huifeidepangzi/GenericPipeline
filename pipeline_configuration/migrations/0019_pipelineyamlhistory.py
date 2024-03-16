# Generated by Django 4.2.10 on 2024-03-16 22:30

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('pipeline_configuration', '0018_remove_pipelineexecutionrecord_logs_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='PipelineYamlHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
                ('description', models.CharField(blank=True, max_length=200)),
                ('body', models.TextField()),
                ('changed_at', models.DateTimeField(auto_now=True)),
                ('changed_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
