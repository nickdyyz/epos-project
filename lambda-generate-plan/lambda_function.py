import json
import uuid
import boto3
from datetime import datetime

s3 = boto3.client('s3')
BUCKET = 'emplan-plan-requests'
REQUESTS_PREFIX = 'requests/'

def lambda_handler(event, context):
    # Parse the request body
    try:
        body = json.loads(event['body']) if 'body' in event else event
    except Exception as e:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid JSON', 'details': str(e)})
        }

    # Require user_id in the request
    user_id = body.get('user_id')
    if not user_id:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Missing user_id'})
        }

    # Generate a unique request ID
    request_id = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat()
    s3_key = f"requests/{user_id}/{request_id}.json"

    # Add metadata
    body['request_id'] = request_id
    body['timestamp'] = timestamp

    # Write to S3
    try:
        s3.put_object(
            Bucket=BUCKET,
            Key=s3_key,
            Body=json.dumps(body),
            ContentType='application/json'
        )
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to write to S3', 'details': str(e)})
        }

    return {
        'statusCode': 200,
        'body': json.dumps({'request_id': request_id, 'status': 'queued'})
    }