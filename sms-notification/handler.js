"use strict";

const messagebird = require("messagebird")(process.env.MESSAGE_BIRD_API_KEY);
const util = require("util");
util.promisify(messagebird.messages.create);

module.exports.send = async (event) => {
  const smsPromises = event.Records.map((record) => {
    const message = JSON.parse(record.body).Message;
    messagebird.messages.create({
      originator: process.env.SMS_PHONE_FROM,
      recipients: [process.env.SMS_PHONE_TO],
      body: message,
    });
  });
  await Promise.all(smsPromises);
  return {
    message: "SMSs sent successfully",
    event,
  };
};
