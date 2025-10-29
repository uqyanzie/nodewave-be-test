#!/bin/sh
set -e

# Wait for MinIO to fully start
sleep 5

# Setup mc alias
mc alias set local http://localhost:9000 minioadmin minioadmin

# Create a bucket (replace 'public-bucket' with your bucket name)
mc mb local/nodewave-be-test || true

# Set the bucket policy to public (read-only)
mc anonymous set download local/nodewave-be-test
