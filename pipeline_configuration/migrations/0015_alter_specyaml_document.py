# Generated by Django 4.2.10 on 2024-03-05 09:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pipeline_configuration', '0014_alter_specyaml_document_link'),
    ]

    operations = [
        migrations.AlterField(
            model_name='specyaml',
            name='document',
            field=models.FileField(blank=True, default=None, null=True, upload_to=''),
        ),
    ]
