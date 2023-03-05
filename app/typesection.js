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

    app.post("/delete_roomtype", (req, res) => {
        var { id } = req.body
        con.query("delete from roomstype where id = ?", [id], (err, result) => {
            res.send({})
        })
    })

    app.post('/add_roomtype', (req, res) => {
        var { add_name_th, add_name, add_price, add_size, add_bed, add_rm_dct, add_ex_bed, add_wifi, add_breakfast, add_air_con, add_tv, add_bath, add_minifridge, add_fitness, add_pool, add_bar } = req.body

        con.query("insert into roomstype values ('',?,?,?,?,0,?,?,?,?,?,?,?,?,?,?,?,?)", [add_name, add_name_th, add_size, add_price, add_ex_bed, add_wifi, add_breakfast, add_air_con, add_tv, add_bath, add_minifridge, add_fitness, add_pool, add_bar, add_rm_dct, add_bed], (err, result) => {
            if (err) throw err
            res.send({})
        })

    })
}