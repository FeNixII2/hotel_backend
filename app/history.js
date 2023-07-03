module.exports = function (app, con) {
    app.get('/history', (req, res) => {
        if (req.session.emp_pos == 2) {
            con.query(`SELECT reserved.id'reserv_id', reserved.*,reserved_status.status_name AS reserved_status,reserved_status.status_id as reserved_status_int,customer.*,payment.pay_type,roomstype.name_th,
            roomstype.bed,roomstype.price,payment_log.*,payment_status.status_name,payment_status.status_class,roomstype.price
                     FROM reserved
                            LEFT JOIN customer on reserved.cus_id = customer.id
                        LEFT JOIN payment on reserved.payment = payment.id
                        LEFT JOIN roomstype on reserved.id_typeroom = roomstype.id
                        LEFT JOIN payment_log ON reserved.reserved_id = payment_log.reserv_code
                        left JOIN payment_status ON payment_log.status = payment_status.status_id
                        LEFT JOIN reserved_status ON reserved.status = reserved_status.status_id`, (err, history) => {
                res.render('history', { history })
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

}