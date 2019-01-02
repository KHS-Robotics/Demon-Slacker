// Slack Client
const Client = require("slack-node");

// Webhooks
var webhooks;

/**
 * Slack Client Wrapper
 */
class SlackClient {
    /**
     * Creates a new Slack Client.
     * @param {*} config config
     */
    constructor(config) {
        webhooks = config.SLACK_WEBHOOKS;
    }

    /**
     * Sends a message to Slack.
     * @param {string} message the message to send to Slack
     */
    sendMessage(message) {
        var sendMessagePromises = [];
        for(var uri of webhooks) {
            sendMessagePromises.push(new Promise((resolve, reject) => {
                var slackClient = new Client();
                slackClient.setWebhook(uri);

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
            }));
        }

        return Promise.all(sendMessagePromises);
    }
}

module.exports = SlackClient;
