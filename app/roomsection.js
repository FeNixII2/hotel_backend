module.exports = function (app, con) {
    app.post('/delete_rooms', (req, res) => {
        var { id } = req.body
        con.query("delete from rooms where id = ?", [id], (err, result) => {
            if (err) throw err
            res.send({})
        })
    })
}