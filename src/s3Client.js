const verifyEnvVars = require('./verifyEnvVars');
verifyEnvVars([
    'AWS_ACCESS_KEY_ID', 
    'AWS_SECRET_ACCESS_KEY', 
    'AWS_BUCKET_NAME',
    'LATEST_UPDATES_KEY'
]);

// Environment Variables
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const LATEST_UPDATES_KEY = process.env.LATEST_UPDATES_KEY;
const LATEST_UPDATE_CONTENT_TYPE = "application/json"

// AWS S3
const AWS = require('aws-sdk');
const s3Client = new AWS.S3({
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
});

// Params to GET team update on S3
const getParams = {
    Bucket: AWS_BUCKET_NAME,
    Key : LATEST_UPDATES_KEY,
    ResponseContentType: LATEST_UPDATE_CONTENT_TYPE
};

// Params to PUT team update on S3
var putParams = {
    Bucket: AWS_BUCKET_NAME,
    Key : LATEST_UPDATES_KEY,
    ContentType: LATEST_UPDATE_CONTENT_TYPE
};

/**
 * Gets the latest team update on Amazon S3.
 */
function getLatestUpdate() {
    return new Promise((resolve, reject) => {
        s3Client.getObject(getParams, (err, response) => {
            if(err) {
                if(err.statusCode === 404) {
                    console.log(
                        "Expected S3 file does not exist! Creating one with a blank JSON as its contents:",
                        LATEST_UPDATES_KEY
                    );

                    console.log("This might be because this is your first time executing the program.");
                    
                    let blank = { team_updates:[] };
                    return putLatestUpdate(blank)
                        .then(response => resolve(blank))
                        .catch(err => console.error("Failed to upload blank update to S3.", err));
                }

                return reject(err);
            }

            return resolve(JSON.parse(response.Body));
        });
    });
}

/**
 * Puts the given team update to S3.
 * @param {*} update the new team update the put on S3
 */
function putLatestUpdate(update) {
    putParams.Body = Buffer.from(JSON.stringify(update));

    return new Promise((resolve, reject) => {
        s3Client.upload(putParams, (err, response) => {
            if(err) {
                return reject(err);
            }

            return resolve(response);
        });
    });
}

module.exports.getLatestUpdate = getLatestUpdate;
module.exports.putLatestUpdate = putLatestUpdate;
