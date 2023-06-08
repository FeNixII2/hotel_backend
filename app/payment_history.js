module.exports = function (app, con) {
    app.get('/payment_history', (req, res) => {
        if (req.session.emp_pos == 2) {
            con.query("SELECT payment_log.id as 'payment_id',payment_log.*,customer.* FROM payment_log,customer WHERE payment_log.cus_id = customer.id", (err, payment) => {
                res.render(('payment_history'), { payment })
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