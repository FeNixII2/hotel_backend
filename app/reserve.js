module.exports = function (app, con) {

    app.get('/reserve', (req, res) => {
        con.query(`select * from listcountry `, (err, listcountry) => {
            if (err) throw err
            con.query(`select * from payment where status_emp = '1' `, (err, payment_type) => {
                if (err) throw err
                res.render(('reserve'), { listcountry, payment_type })

            })
        })
    })

}