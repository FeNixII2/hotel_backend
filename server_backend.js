const express = require("express");
const app = express();
const session = require("express-session");
const mysql = require("mysql");
const moment = require("moment");

// database connect setup
const con = mysql.createConnection({
    host: "25.19.244.218",
    // host: "localhost",
    user: "root",
    password: "",
    database: "hotel",
    connectTimeout: 10000,
});

con.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("database connected!");
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
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
    })
);

//port setting to run on the server
var port = 8888;
app.listen(port, () => {
    console.log("web start listening on port  : " + port);
});

app.get("/", (req, res) => {
    con.query("SELECT * FROM reserved,customer,payment WHERE reserved.cus_id = customer.id AND reserved.payment = payment.id AND reserved.status = '0'", (err, unconfirm_room) => {
        if (err) throw err
        con.query("SELECT * FROM payment_log,customer WHERE payment_log.cus_id = customer.id", (err, payment) => {
            if (err) throw err
            con.query("SELECT * FROM reserved,customer,payment WHERE reserved.cus_id = customer.id AND reserved.payment = payment.id", (err, all_room) => {
                if (err) throw err
                res.render("mainpage.ejs", { unconfirm_room, payment, all_room });
            })
        })
    })
});

//js file include
// require("./app/typesection.js")(app, con);