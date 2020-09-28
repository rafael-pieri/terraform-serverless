"use strict";

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_FROM_PASSWORD,
  },
});

module.exports.send = async (event) => {
  const emailPromises = event.Records.map((record) => {
    const message = JSON.parse(record.body).Message;
    transporter.sendMail({
      from: `"Bookings 👻" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_TO,
      subject: "Booking performed ✔",
      text: message,
      html: message,
    });
  });
  await Promise.all(emailPromises);
  return {
    message: "All emails sent successfully",
    event,
  };
};
