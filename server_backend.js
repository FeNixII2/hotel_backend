const express = require("express");
const app = express();
const session = require("express-session");
const mysql = require("mysql");
const moment = require('moment');


// database connect setup
const con = mysql.createConnection({
    host: "25.19.244.218",
    // host: "localhost",
    user: "root",
    password: "",
    database: "hotel",
    connectTimeout: 100000,
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

    con.query("select * from rooms", (err, rooms) => {
        con.query("select * from reserv", (err, reserv) => {
            con.query("select * from roomstype", (err, roomstype) => {
                res.render("mainpage.ejs", { rooms, reserv, roomstype });
            })
        })
    })

});
//js file include
// require("./app/empty.js")(app, con);