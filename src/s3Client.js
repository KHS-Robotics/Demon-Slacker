// AWS SDK
const AWS = require('aws-sdk');

// Internal S3 Client Object
var s3Client;

/**
 * Amazon S3 Client Wrapper
 */
class S3Client {
    /**
     * Creates a new Amazon S3 Client.
     * @param {*} config config
     */
    constructor(config) {
        s3Client = new AWS.S3({
            credentials: {
                accessKeyId: config.credentials.AWS_ACCESS_KEY_ID,
                secretAccessKey: config.credentials.AWS_SECRET_ACCESS_KEY
            },
            region: config.REGION
        });

        this.getParams = {
            Bucket: config.AWS_BUCKET_NAME,
            Key: config.LATEST_TEAM_UPDATE_KEY,
            ResponseContentType: "application/json"
        };

        this.putParams = {
            Bucket: config.AWS_BUCKET_NAME,
            Key: config.LATEST_TEAM_UPDATE_KEY,
            ContentType: "application/json"
        };
    }

    /**
     * Gets the latest team update on Amazon S3.
     */
    getLatestUpdate() {
        return new Promise((resolve, reject) => {
            s3Client.getObject(this.getParams, (err, response) => {
                if (err) {
                    if (err.statusCode === 404) {
                        console.log(
                            "Expected S3 file does not exist! Creating one with a blank JSON as its contents:", 
                            LATEST_TEAM_UPDATE_KEY
                        );
                        console.log("This might be because this is your first time executing the program.");

                        let blank = { team_updates: [] };
                        return this.putLatestUpdate(blank)
                                .then(response => resolve(blank))
                                .catch(err => reject(err));
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
    putLatestUpdate(update) {
        this.putParams.Body = Buffer.from(JSON.stringify(update));

        return new Promise((resolve, reject) => {
            s3Client.upload(this.putParams, (err, response) => {
                if (err) {
                    return reject(err);
                }

                return resolve(response);
            });
        });
    }
}

module.exports = S3Client;
