module.exports = function(app, con) {

    app.post('/get_edit_data', (req, res) => {
        var { id } = req.body
        con.query("select * from roomstype where id = ?", [id], (err, type_info) => {
            res.send({ type_info })
        })
    })

    app.post("/update_type_room", (req, res) => {
        var { ex_bed, wifi, breakfast, air_con, tv, bath, minifridge, fitness, pool, bar, id, name_th, name, price, size, rm_dct, bed } = req.body
        con.query("update roomstype set name = ?,name_th = ?,size = ?,price = ?,ex_bed = ?,wifi= ?,breakfast = ?,air_con = ?,tv = ?,bath = ?,minifridge = ?,fitness =?,pool=?,bar=?,rm_dct=?,bed=? where id=?", [name, name_th, size, price, ex_bed, wifi, breakfast, air_con, tv, bath, minifridge, fitness, pool, bar, rm_dct, bed, id], (err, result) => {
            if (err) throw err
            res.send({})
        })
    })
}