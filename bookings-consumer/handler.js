"use strict";

const AWS = require("aws-sdk");
AWS.config.update({
  region: process.env.AWS_REGION,
});

const SNS = new AWS.SNS();
const converter = AWS.DynamoDB.Converter;

const moment = require("moment");

module.exports.listen = async (event) => {
  const snsPromises = [];

  for (const record of event.Records) {
    if (record.eventName === "INSERT") {
      const booking = converter.unmarshall(record.dynamodb.NewImage);
      const message = {
        TopicArn: process.env.SNS_NOTIFICATIONS_TOPIC,
        Message: `Booking performed: User ${booking.user.name} (${
          booking.user.email
        }) scheduled a time in: ${moment(booking.date).format("LLLL")}`,
      };
      snsPromises.push(SNS.publish(message).promise());
    }
  }

  try {
    await Promise.all(snsPromises);
    console.log("Messages sent successfully");
  } catch (err) {
    console.log(err);
  }
};
