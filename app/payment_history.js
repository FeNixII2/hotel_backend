module.exports = function(app, con) {
    app.post('/payment_history', (req, res) => {
        con.query("SELECT * FROM payment_log,customer WHERE payment_log.cus_id = customer.id", (err, payment) => {
            res.render(('history'), { payment })
        })
    })
}