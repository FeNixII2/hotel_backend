module.exports = function(app, con, moment) {
    app.get('/checkout', (req, res) => {
        if (req.session.emp_pos == 2) {
            con.query("SELECT *,reserved.id as reserv_id FROM reserved INNER JOIN customer ON reserved.cus_id = customer.id INNER JOIN roomstype ON reserved.id_typeroom = roomstype.id WHERE status NOT IN (0, 4,5); ", (err, stay) => {
                if (err) throw err
                res.render(('checkout'), { stay })
            })
        } else {
            req.session.destroy((err) => {
                if (err) {
                    console.log('Error destroying session:', err);
                } else {
                    res.render('login.ejs');
                }
            });
        }
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
        con.query("select * from reserved where id =?", [reserv_id], (err, reserv_info) => {
            con.query("insert into checkout_comment (detail,date,cus_id,room_number,type,reserved_id)  values (?,?,?,?,?,?)", [more_cus_comment, currentDate, id, reserv_info[0].num_room, '1', reserv_id], (err, result) => {
                if (err) throw err
                con.query("update reserved set status = 4 where id = ?", [reserv_id], (err, result) => {
                    con.query("update rooms set status = 0 where num_room = ?", [reserv_info[0].num_room], (err, result) => {
                        if (err) throw err
                        res.send({})
                    })
                })
            })
        })
    })

    app.post('/get_comment', (req, res) => {
        var { num_room, cus_id } = req.body
        con.query("SELECT * FROM checkout_comment WHERE TYPE = 2 and room_number = ? ORDER BY id desc", [num_room], (err, room_coms) => {
            con.query("SELECT * FROM checkout_comment WHERE TYPE = 1 and cus_id = ? ORDER BY id desc", [cus_id], (err, cus_coms) => {
                console.log(room_coms);
                res.send({ room_coms, cus_coms })
            })
        })
    })
}