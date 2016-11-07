var Slack = require('slack-node');

function Slacker(webhookUri) {
  this.webhookUri = webhookUri;
  this.slacker = new Slack(this.webhookUri);
}

Slacker.prototype.sendMessage = function(message, callback) {
  this.slacker.webhook({ text: message }, callback);
}

module.exports = Slacker;
