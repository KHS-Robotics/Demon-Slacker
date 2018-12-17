const verifyEnvVars = require('./verifyEnvVars');
verifyEnvVars([
    'SLACK_WEBHOOK_URI'
]);

// Environment Variables
const SLACK_WEBHOOK_URI = process.env.SLACK_WEBHOOK_URI;

// Slack client
const SlackClient = require("slack-node");
const slackClient = new SlackClient();

// Set Slack Webhook
slackClient.setWebhook(SLACK_WEBHOOK_URI);

/**
 * Sends a message to Slack.
 * @param {string} message the message to send to Slack
 */
function sendMessage(message) {
    return new Promise((resolve, reject) => {
        slackClient.webhook({ text: message }, (err, response) => {
            if(err) {
                return reject(err);
            }

            return resolve({
                status: response.status, 
                statusCode: response.statusCode
            });
        });
    });
}

module.exports = sendMessage;
