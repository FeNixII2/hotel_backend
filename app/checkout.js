module.exports = function(app, con) {
    app.post('/checkout', (req, res) => {
        con.query("SELECT *,reserved.id as reserv_id FROM reserved INNER JOIN customer ON reserved.cus_id = customer.id INNER JOIN roomstype ON reserved.id_typeroom = roomstype.id WHERE status = 1; ", (err, stay) => {
            if (err) throw err
            res.render(('checkout'), { stay })
        })
    })

    app.post('/confirm_checkout', (req, res) => {

    })

}