const cron = require('node-cron');
const connectionRequest = require('../models/connectionRequest');
const { subDays, startOfDay, endOfDay } = require('date-fns');
const sendEmail = require('./sendEmail');

cron.schedule('0 8 * * *', async () => {
    //Send email to all people who got a request the previous day at 8 am
    try {
        const yesterday = subDays(new Date(), 1);

        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const pendingRequests = await connectionRequest.find({
            status: 'interested',
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd,
            }
        }).populate('fromUserId toUserId');



        const listOfEmails = [...new Set(pendingRequests.map(request => request.toUserId.emailId
        ))];


        for (const emailId of listOfEmails) {
            // Send email
            try {
                const res = await sendEmail.run(
                    "New connection request pending for " + emailId,
                    `You have received a new connection request from someone on MatchTinder. Please check your requests page to view and respond to the request. Thanks`
                );
                // console.log(`Email sent to ${emailId}:`, res);
            }
            catch (error) {
                console.error(`Failed to send email to ${emailId}:`, error);
            }

        }

    } catch (error) {
        console.error("Error in cron job:", error);
    }
});