# Generated by Django 4.2.10 on 2024-02-25 06:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("pipeline_configuration", "0004_alter_specyaml_pipeline_yaml"),
    ]

    operations = [
        migrations.AddField(
            model_name="specyaml",
            name="description",
            field=models.CharField(blank=True, max_length=200),
        ),
    ]
