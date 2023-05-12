const session = require("express-session");

module.exports = function(app, con) {
    app.post('/login', (req, res) => {
        var { username, password } = req.body
        console.log(username, password);
        con.query("select * from emp where emp_id = ? and emp_password = ?", [username, password], (err, id) => {
            console.log(id.length);
            if (id.length != 0) {
                req.session.emp_fname = id[0].emp_fname
                req.session.emp_lname = id[0].emp_lname
                req.session.emp_pos = id[0].emp_pos
                console.log(req.session.emp_pos);
                res.send({ success: true, pos: req.session.emp_pos })
            }
            if (id.length == 0) {
                console.log('here');
                res.send({ success: false, pos: req.session.emp_pos })
            }
        })

    })


}