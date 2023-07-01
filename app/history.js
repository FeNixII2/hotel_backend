module.exports = function (app, con) {
    app.get('/history', (req, res) => {
        if (req.session.emp_pos == 2) {
            con.query("SELECT reserved.id'reserv_id', reserved.*,customer.*,payment.pay_type,roomstype.name_th,roomstype.bed FROM reserved,customer,payment,roomstype WHERE reserved.cus_id = customer.id AND reserved.payment = payment.id AND reserved.id_typeroom = roomstype.id ", (err, history) => {
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