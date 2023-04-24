module.exports = function(app, con, moment) {
    app.post('/maidindex', (req, res) => {
        con.query("select * from rooms", (err, room) => {
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

    app.post('/done_cleaning', (req, res) => {
        var { id, room_comment } = req.body
        const currentDate = moment().format('DD/MM/YYYY HH:mm:ss');
        con.query("select num_room from rooms where id = ?", [id], (err, num_room) => {
            if (err) throw err
            con.query("insert into cleaning_comment values ('',?,?,?)", [num_room[0].num_room, room_comment, currentDate], (err, result) => {
                if (err) throw err
                con.query("update rooms set status = 2 where id = ?", [id], (err, result) => {
                    if (err) throw err
                    res.send({})
                })
            })
        })
    })

    app.post('/maidroomchecking', (req, res) => {
        con.query("select * from reserved where status = 2", (err, wait_for_check) => {
            if (err) throw err
            res.render('maid/maidroomchecking.ejs', { wait_for_check })
        })
    })

    app.post('/done_checking', (req, res) => {
        var {
            id,
            checking_comment
        } = req.body
        const currentDate = moment().format('DD/MM/YYYY HH:mm:ss');
        con.query("select * from reserved where id = ?", [id], (err, reserved_info) => {
            if (err) throw err
            reserved_info = reserved_info[0]
            con.query("insert into checkout_comment (detail,date,cus_id,room_number,type) values (?,?,?,?,?)", [checking_comment, currentDate, reserved_info.cus_id, reserved_info.num_room, '2'], (err, comment_insert) => {
                if (err) throw err
                var insert_id = comment_insert.insertId
                con.query("update reserved set status = '3' where id = ?", [id], (err, result) => {
                    if (err) throw err
                    res.send({})
                })
            })
        })
    })

}