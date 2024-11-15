# Generated by Django 4.2.10 on 2024-03-05 09:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("pipeline_configuration", "0015_alter_specyaml_document"),
    ]

    operations = [
        migrations.AlterField(
            model_name="specyaml",
            name="pipeline_yaml",
            field=models.ManyToManyField(
                blank=True,
                default=None,
                related_name="specyamls",
                to="pipeline_configuration.pipelineyaml",
            ),
        ),
    ]
