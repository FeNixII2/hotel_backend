module.exports = function (app, con) {
    app.post('/payment_history', (req, res) => {
        con.query("SELECT payment_log.id as 'payment_id',payment_log.*,customer.* FROM payment_log,customer WHERE payment_log.cus_id = customer.id", (err, payment) => {
            res.render(('payment_history'), { payment })
        })
    })
}