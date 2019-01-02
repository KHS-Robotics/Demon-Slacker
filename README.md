# FRC Team Updates Slack Notifer - v2
Automatically notify your team about an update to the FRC game manual on Slack using Amazon S3 and Lambda.

## How To Get It Working For Your Team As Is.
1. Install and setup AWS CLI:
```
# Install AWS CLI
pip install awscli

# Configure AWS on your machine
aws configure

# Get your IAM user to make sure aws configure worked
aws iam get-user
```

2. Install and setup Serverless
```
# Install Serverless CLI
npm install -g serverless

# Create Serverless AWS NodeJS Lambda Config
serverless create -t aws-nodejs

# Deploy Lambda Function
serverless deploy
```

3. [Setup Environment Variables for the Lambda function in the Console.](https://docs.aws.amazon.com/lambda/latest/dg/env_variables.html)
```
1. AWS_ACCESS_KEY_ID
2. AWS_SECRET_ACCESS_KEY
3. AWS_REGION
4. AWS_BUCKET_NAME
5. LATEST_TEAM_UPDATE_KEY
6. SLACK_WEBHOOK_URI
```

### TODO
1. Remove AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables in lieu of the lambda function's IAM role.
2. Get the code running using the minumum permissions needed and figure out what those are.
3. Get the code in an "npm publishable" state.
4. Possibly using AWS Secret Manager instead of environment variables
