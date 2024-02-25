# Use an official Python runtime as a parent image
FROM python:3.9

# Set environment variables
# ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Expose port 8000 to the outside world
EXPOSE 8000

# Define the command to run your Django project
CMD ["python", "./generic_pipeline/manage.py", "runserver", "0.0.0.0:8000"]