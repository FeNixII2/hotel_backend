module.exports = function (app, con) {
    app.get('/maid_his', (req, res) => {
        if (req.session.emp_pos == 2) {
            con.query("select * from rooms", (err, room) => {
                if (err) throw err
                res.render(('maid_his.ejs'), { room })
            })
        } else {
            req.session.destroy((err) => {
                if (err) {
                    console.log('Error destroying session:', err);
                } else {
                    res.render('login.ejs');
                }
            });
        }
    })
}