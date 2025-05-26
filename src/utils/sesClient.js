const { SESClient } = require("@aws-sdk/client-ses");
// Set the AWS Region.
// Create SES service object.
const sesClient = new SESClient({
    region: process.env.REGION, credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

module.exports = { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]