const express = require("express");
const app = express();
const session = require("express-session");
const mysql = require("mysql");
const moment = require("moment");
const nodemailer = require('nodemailer');

const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf');

// database connect setup
const con = mysql.createConnection({
    // host: "192.168.0.102",
    host: "localhost",
    user: "root",
    password: "",
    database: "hotel",
    connectTimeout: 10000,
});
``
con.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("database connected!");
    }
});

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'testinghotel9@gmail.com',
        pass: 'ucxlsabofuibbsci'
    }
});



//app setup
app.use(express.static("public"));
app.use(express.static("public/icons"));
app.use(express.static("public/attraction"));
app.use(express.static("css"));
app.use(express.static("app"));

app.use(express.static("views"));
app.set("view engine", "ejs");
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ limit: "100kb", extended: true }));

app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1800000, // 0.5 hour in milliseconds
        },
    })
);

//port setting to run on the server
var port = 8888;
app.listen(port, () => {
    console.log("web start listening on port  : " + port);
});

app.get("/", (req, res) => {
    if (req.session.isLoggedIn) {
        choosepage(req.session.emp_pos, function (page) {
            console.log(page);
            res.redirect(page)
        })
    } else {
        res.render("login.ejs");
    }
});

//js file include
require("./app/roomconfirmation.js")(app, con, transporter, fs, path, pdf, moment);
require("./app/payment_history.js")(app, con);
require("./app/history.js")(app, con);
require("./app/chambermaid.js")(app, con, moment);
require("./app/checkout.js")(app, con, moment);
require("./app/maidhistory.js")(app, con);
require("./app/login.js")(app, con);