module.exports = function(app, con) {

    app.post('/get_edit_data', (req, res) => {
        var { id } = req.body
        con.query("select * from roomstype where id = ?", [id], (err, type_info) => {

            res.send({ type_info })
        })
    })

    app.post("/update_type_room", (req, res) => {

    })
}