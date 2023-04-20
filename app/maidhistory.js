module.exports = function(app, con) {
    app.post('/maid_his', (req, res) => {
        con.query("select * from rooms", (err, room) => {
            if (err) throw err
            res.render(('maid_his.ejs'), { room })
        })
    })
}