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

# Deploy Lambda Function - By default
# the yml is setup to scrape every 15 minutes.
# You can change this on line 50 of serverless.yml
serverless deploy --stage prod
```

3. [Setup Environment Variables for the Lambda function in the Console.](https://docs.aws.amazon.com/lambda/latest/dg/env_variables.html)
```
1. FRC_AWS_ACCESS_KEY_ID - the Access Key ID of the IAM user accessing S3
2. FRC_AWS_SECRET_ACCESS_KEY - the Secret Access Key of the IAM user accessing S3
3. FRC_AWS_REGION - the region of the S3 bucket holding the latest team update
4. AWS_BUCKET_NAME - the name of the S3 bucket holding the latest team update
5. LATEST_TEAM_UPDATE_KEY - the latest team update key for the S3 bucket
6. SLACK_WEBHOOK_URI - the URI of the slack webhook
```

## TODO
1. Remove FRC_AWS_ACCESS_KEY_ID and FRC_AWS_SECRET_ACCESS_KEY environment variables in favor of the lambda function's IAM role.
2. Get the code running using the _minumum_ permissions needed and figure out what those are.
3. Get the code in an "_npm publishable_" state.
4. _Possibly_ using AWS Secret Manager instead of environment variables.
