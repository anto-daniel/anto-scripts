import boto3
import os
s3 = boto3.resource(
    service_name='s3',
    region_name=os.getenv('region'),
    aws_access_key_id=os.getenv('aws_access_key_id'),
    aws_secret_access_key=os.getenv('aws_secret_access_key')
)
print("conntect to s3")
buckets = list(s3.buckets.all())
print(buckets)
