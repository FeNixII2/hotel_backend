module.exports = function (app, con) {
    app.post('/maidindex', (req, res) => {
        con.query("select * from rooms where status !=3", (err, room) => {
            if (err) throw err
            res.render(('maid/maidindex.ejs'), { room })
        })
    })
    app.post('/get_todo_data', (req, res) => {
        var { id } = req.body
        con.query("select * from cleaning_checklist", (err, checklist) => {
            if (err) throw err
            con.query("update rooms set status = 1 where id = ?", [id], (err, result) => {
                if (err) throw err
                res.send({ checklist })
            })
        })
    })

}