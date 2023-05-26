const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

const User = require("./models/User");

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then((con) => {
    console.log("Database Connection Was Successfull");
  })
  .catch((err) => {
    console.log(`connection unsucessfull ${err}`);
  });

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/api/v1/home", (req, res) => {
  res.send("<h2>WELCOME!</h2>");
});

app.get("/api/v1/register", (req, res) => {
  res.render("form");
});

app.post("/api/v1/register", (req, res) => {
  try {
    var newUser = {
      username: req.body.username,
      password: req.body.password,
    };

    if (!(!req.body.username && !req.body.password)) {
      var user = new User(newUser); // User is the mongoose model , adding the newly created javascript object into the model
      user.save(); // now saving it
      res.send("Done");
    } else {
      res.send("<h2>One of the fields is empty </h2>");
    }
  } catch (error) {}
});

app.get("/api/v1/login", (req, res) => {
  res.render("login");
});

app.post("/api/v1/login", (req, res) => {
  var user = User.findOne({ username: req.body.username }); // this is not returning a javascript object...
  console.log(req.body.username)
  console.log(user);
  if (user) {
    const result = req.body.password === user.password;
    if (result) {
      res.redirect("/api/v1/dashboard");
    } else {
      res.status(404).json({ error: "entered passoword doesnt match" });
    }
  } else {
    res.redirect("/api/v1/register");
  }
});

app.get("/api/v1/dashboard", (req, res) => {
  res.send("<h1>Welcome to the dashboard </h1>");
});

const PORT = process.env.PORT || 6001;

app.listen(PORT, () => {
  console.log(`The server is running on ${PORT}`);
});
