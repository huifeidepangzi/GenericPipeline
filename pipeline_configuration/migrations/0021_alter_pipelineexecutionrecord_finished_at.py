# Generated by Django 4.2.10 on 2024-03-17 08:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pipeline_configuration', '0020_alter_pipelineexecutionrecord_finished_at_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pipelineexecutionrecord',
            name='finished_at',
            field=models.DateTimeField(blank=True, default=None, null=True),
        ),
    ]
