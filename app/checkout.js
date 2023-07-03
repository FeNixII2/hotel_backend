module.exports = function (app, con, moment) {
    app.get('/checkout', (req, res) => {
        if (req.session.emp_pos == 2) {
            con.query(`SELECT reserved.id'reserv_id', reserved.*,reserved_status.status_name AS reserved_status,reserved_status.status_id as reserved_status_int,customer.*,payment.pay_type,roomstype.name_th,
            roomstype.bed,roomstype.price,payment_log.*,payment_status.status_name,payment_status.status_class,roomstype.price
                     FROM reserved
                            LEFT JOIN customer on reserved.cus_id = customer.id
                        LEFT JOIN payment on reserved.payment = payment.id
                        LEFT JOIN roomstype on reserved.id_typeroom = roomstype.id
                        LEFT JOIN payment_log ON reserved.reserved_id = payment_log.reserv_code
                        left JOIN payment_status ON payment_log.status = payment_status.status_id
                        LEFT JOIN reserved_status ON reserved.status = reserved_status.status_id
                        WHERE  reserved.status NOT IN (0, 4,5)`, (err, stay) => {
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
        console.log(id);
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
                // console.log(room_coms);
                res.send({ room_coms, cus_coms })
            })
        })
    })
}