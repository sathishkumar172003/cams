const { MailtrapClient } = require("mailtrap");

const TOKEN = "d05a71af2cf8db550847034ce646825d";
const ENDPOINT = "https://send.api.mailtrap.io/";

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

const sender = {
  email: "mailtrap@google.com",
  name: "Mailtrap Test",
};
const recipients = [
  {
    email: "sthshkmr172003@gmail.com",
  }
];


module.exports = client;


// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);