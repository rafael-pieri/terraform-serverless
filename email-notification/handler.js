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
  const emailPromises = [];

  for (const record of event.Records) {
    const message = JSON.parse(record.body).Message;
    emailPromises.push(
      transporter.sendMail({
        from: `"Bookings 👻" <${process.env.EMAIL_FROM}>`,
        to: process.env.EMAIL_TO,
        subject: "Booking performed ✔",
        text: message,
        html: message,
      })
    );
  }

  try {
    await Promise.all(emailPromises);
    console.log("All emails sent successfully");
  } catch (err) {
    console.log(err);
  }
};
