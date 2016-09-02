var Slack = require('slack-node');

var WebhookUri = undefined;

var slacker = {
  setWebhookUri: function(webhookUri) {
    WebhookUri = webhookUri
  },
  sendMessage: function(message) {
    new Slack().setWebhook(WebhookUri).webhook({ text: message }, function(err, response) {
      if (err) 
        return console.log(err);
    });
  }
}

module.exports = slacker;
