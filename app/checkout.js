module.exports = function(app, con, moment) {
    app.post('/checkout', (req, res) => {
        con.query("SELECT *,reserved.id as reserv_id FROM reserved INNER JOIN customer ON reserved.cus_id = customer.id INNER JOIN roomstype ON reserved.id_typeroom = roomstype.id WHERE status NOT IN (0, 4); ", (err, stay) => {
            if (err) throw err
            res.render(('checkout'), { stay })
        })
    })

    app.post('/room_checking', (req, res) => {
        var { id } = req.body
        con.query("update reserved set status = 2 where id = ?", [id], (err, result) => {
            if (err) throw err
            res.send({});
        })
    })


    app.post('/confirm_checkout', (req, res) => {
        var { id, more_cus_comment, reserv_id } = req.body
        const currentDate = moment().format('DD/MM/YYYY HH:mm:ss');
        con.query("insert into cus_comment value ('',?,?,?)", [more_cus_comment, currentDate, id], (err, result) => {
            if (err) throw err
            con.query("update reserved set status = 4 where id = ?", [reserv_id], (err, result) => {
                if (err) throw err
                res.send({})
            })
        })
    })

}