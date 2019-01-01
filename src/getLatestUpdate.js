const request = require('request-promise');
const cheerio = require('cheerio');

// Options for web request
const options = {
  uri: "http://www.firstinspires.org/resource-library/frc/competition-manual-qa-system",
  transform: body => {
    return cheerio.load(body);
  }
}

/**
 * Gets the latest FRC team updates.
 */
function getLatestUpdates() {
  return new Promise((resolve, reject) => {
    console.log("Scraping for team update.");
    
    var results = [];
  
    request(options)
      .then($ => {
        $('.field-name-body tbody tr:nth-child(4) td ul li a').each((anchorTag, elem) => {
          var title = $(this).text();
          var url = $(this).attr('href');
          
          results.push({ "title" : title, "url": url });
        });
  
        return resolve(JSON.parse(JSON.stringify({ "team_updates": results })));
      }).catch(err => {
        return reject(err);
      });
  });
}

module.exports = getLatestUpdates;
