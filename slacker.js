var Slack = require('slack-node');

webhookUri = "";

slack = new Slack();
slack.setWebhook(webhookUri);

module.exports = {

  sendMessage: function(text){

    slack.webhook({ text: text }, function(err, response) {
      if (err) return console.log(err);
    });

  }

};
