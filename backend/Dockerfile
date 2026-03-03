# 1. Use an official, lightweight Python image
FROM python:3.11-slim

# 2. Set environment variables to optimize Python in Docker
# Prevents Python from writing .pyc files to disk
ENV PYTHONDONTWRITEBYTECODE 1
# Ensures console output is not buffered, so logs show up instantly
ENV PYTHONUNBUFFERED 1

# 3. Set the working directory inside the container
WORKDIR /app

# 4. Install system dependencies
# We need gcc and libpq-dev for the PostgreSQL adapter.
# We also install gdal-bin and libproj-dev. These are crucial spatial libraries 
# needed by GeoDjango to calculate the distance to the UCLA campus and handle the polylines.
RUN apt-get update \
    && apt-get install -y gcc libpq-dev gdal-bin binutils libproj-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 5. Copy requirements and install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# 6. Copy the rest of your Django code into the container
COPY . /app/