"use strict";
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

module.exports = app;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public/"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});
app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/success.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.userEmail;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const url = `https://us21.api.mailchimp.com/3.0/lists/${process.env.NEWSLETTER_LIST_KEY}`;
  const options = {
    method: "post",
    auth: `geoffrey:${process.env.NEWSLETTER_API_KEY}`,
  };
  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

// app.listen(3000, () => {
//   console.log("Server running on port 3000.");
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
