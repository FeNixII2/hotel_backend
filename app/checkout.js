module.exports = function(app, con) {
    app.post('/checkout', (req, res) => {
        con.query("SELECT reserved.*,customer.* FROM reserved INNER JOIN customer ON reserved.cus_id = customer.id WHERE status = 1; ", (err, stay) => {
            if (err) throw err
            res.render(('checkout'), { stay })
        })
    })

}