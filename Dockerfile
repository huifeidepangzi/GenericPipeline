# Use an official Python runtime as a parent image
FROM python:3.9

# Set the working directory in the container
WORKDIR /app

# Copy and install dependencies
COPY requirements.txt /app
RUN pip install -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . /app

# Collect all static files
RUN python manage.py collectstatic --no-input
