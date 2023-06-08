const session = require("express-session");

module.exports = function (app, con) {
    app.post('/login', (req, res) => {
        var { username, password } = req.body
        con.query("select * from emp where emp_id = ? and emp_password = ?", [username, password], (err, id) => {
            if (id.length != 0) {
                req.session.emp_id = id[0].id
                req.session.emp_fname = id[0].emp_fname
                req.session.emp_lname = id[0].emp_lname
                req.session.emp_pos = id[0].emp_pos
                req.session.isLoggedIn = true;
                choosepage(req.session.emp_pos, function (page) {
                    res.send({ success: true, pos: req.session.emp_pos, page })
                })
            } else if (id.length == 0) {
                res.send({ success: false, pos: req.session.emp_pos })
            }
        })
    })

    function choosepage(pos, callback) {
        let page
        if (pos == 1) {
            page = '/maidindex'
        } else if (pos == 2) {
            page = '/index'
        }
        callback(page);
    }

    app.get('/index', (req, res) => {

        if (req.session.isLoggedIn && req.session.emp_pos == 2) {
            res.render('index.ejs')
        } else {
            res.render("login.ejs");
        }

    })
    // app.post('/index', (req, res) => {
    //     res.render(('index.ejs'))
    // })

    app.post('/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.log('Error destroying session:', err);
            } else {

                // Redirect or render a logged-out page
                res.render('login.ejs');
            }
        });
    })
}