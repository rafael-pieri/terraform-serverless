"use strict";

const AWS = require("aws-sdk");
AWS.config.update({
  region: process.env.AWS_REGION,
});

const SNS = new AWS.SNS();
const converter = AWS.DynamoDB.Converter;

const moment = require("moment");

module.exports.listen = async (event) => {
  const snsPromises = event.Records.map((record) => {
    if (record.eventName === "INSERT") {
      const booking = converter.unmarshall(record.dynamodb.NewImage);
      SNS.publish({
        TopicArn: process.env.SNS_NOTIFICATIONS_TOPIC,
        Message: `Booking performed: User ${booking.user.name} (${
          booking.user.email
        }) scheduled a time in: ${moment(booking.date).format("LLLL")}`,
      }).promise();
    }
  });
  await Promise.all(snsPromises);
  return {
    message: "Messages sent successfully",
    event,
  };
};
