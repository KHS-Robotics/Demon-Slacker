// Slack client
const Client = require("slack-node");
var slackClient;

/**
 * Slack Client Wrapper
 */
class SlackClient {
    /**
     * Creates a new Slack Client
     * @param {*} config config
     */
    constructor(config) {
        slackClient = new Client();
        slackClient.setWebhook(config.SLACK_WEBHOOK_URI);
    }

    /**
     * Sends a message to Slack.
     * @param {string} message the message to send to Slack
     */
    sendMessage(message) {
        return new Promise((resolve, reject) => {
            slackClient.webhook({ text: message }, (err, response) => {
                if(err) {
                    return reject(err);
                }
    
                let retval = {
                    status: response.status,
                    statusCode: response.statusCode
                };
    
                return response.statusCode < 400 ? resolve(retval) : reject(retval);
            });
        });
    }
}

module.exports = SlackClient;
