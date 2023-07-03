module.exports = function (app, con) {
    app.get('/payment_history', (req, res) => {
        if (req.session.emp_pos == 2) {
            con.query(`SELECT pl.*,c.f_name,c.l_name,c.p_num,c.email ,r.num_room,pt.pay_type,ps.status_name,ps.status_class
            FROM payment_log AS pl
            LEFT JOIN customer AS c ON pl.cus_id = c.id
            LEFT JOIN reserved AS r on pl.reserv_code = r.reserved_id
            LEFT JOIN payment AS pt ON pl.payment_type = pt.id
            LEFT JOIN  payment_status AS ps ON pl.status = ps.status_id`, (err, payment) => {
                res.render(('payment_history'), { payment })
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