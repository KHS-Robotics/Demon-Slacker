'use strict';

const config = {
    aws: {
        credentials: {
            AWS_ACCESS_KEY_ID: process.env.FRC_AWS_ACCESS_KEY_ID,
            AWS_SECRET_ACCESS_KEY: process.env.FRC_AWS_SECRET_ACCESS_KEY
        },
        AWS_REGION: process.env.AWS_REGION,
        AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
        LATEST_TEAM_UPDATE_KEY: process.env.LATEST_TEAM_UPDATE_KEY,
    },
    slack: {
        SLACK_WEBHOOKS: [process.env.SLACK_WEBHOOK_URI]
    }
};

const checkForTeamUpdate = require('./src/checkForTeamUpdate');

module.exports.checkForTeamUpdate = (event, context, callback) => {
    checkForTeamUpdate(config)
        .then(updateDetected => {
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    updateDetected: updateDetected
                })
            });
        })
        .catch(err => {
            callback(null, {
                statusCode: 500,
                body: JSON.stringify({
                    error: err.message || err
                })
            });
        });
};
