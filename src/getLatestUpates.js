var request = require('request-promise');
var cheerio = require('cheerio');

// This URI may/probably will change every year, at which point we would probably
// have to update this scraper to target the correct HTML elements again
var URI = "http://www.firstinspires.org/resource-library/frc/competition-manual-qa-system";
var options = {
    uri: URI,
    transform: function(body) {
      return cheerio.load(body);
    }
  }

function extractDate(str) {
  var date = str.substring(str.lastIndexOf("d") + 1,str.lastIndexOf(")")).trim();

  return date;
};

var getLatestUpdates = function(callback) {
  var results = [];

  request(options)
    .then(function($) {
      $('.field-name-body tbody tr:nth-child(5) td ul li a').each(function(anchorTag, elem) {
        var date = extractDate($(this).parent().text());
        var title = $(this).text();
        var url = $(this).attr('href');
        
        results.push({ "title" : title, "date": date, "url": url });
      });

      callback(null, JSON.parse(JSON.stringify({"team_updates": results })));
    })
    .catch(function(err) {
      callback(err, null);
    });
}

module.exports = getLatestUpdates;
