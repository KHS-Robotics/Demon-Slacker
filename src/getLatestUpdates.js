var request = require('request-promise');
var cheerio = require('cheerio');

var getLatestUpdates = function(uri, callback) {
  var options = {
    uri: uri,
    transform: function(body) {
      return cheerio.load(body);
    }
  }

  var results = [];

  request(options)
    .then(function($) {
      $('.field-name-body tbody tr:nth-child(4) td ul li a').each(function(anchorTag, elem) {
        var title = $(this).text();
        var url = $(this).attr('href');
        
        results.push({ "title" : title, "url": url });
      });

      callback(null, JSON.parse(JSON.stringify({"team_updates": results })));
    })
    .catch(function(err) {
      callback(err, null);
    });
}

module.exports = getLatestUpdates;
