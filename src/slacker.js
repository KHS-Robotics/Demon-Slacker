var Slack = require('slack-node');

function Slacker(webhookUri) {
  this.webhookUri = webhookUri;
}

Slacker.prototype.sendMessage = function(message, callback) {
  var slack = new Slack(this.webhookUri);

  var payload = {
    text: message
  }

  slack.webhook(payload, callback);
}

module.exports = Slacker;
