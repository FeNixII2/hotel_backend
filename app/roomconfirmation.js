module.exports = function (app, con) {
    app.post('/indexroomconfirmation', (req, res) => {
        con.query("SELECT reserved.id'reserv_id', reserved.*,customer.*,payment.pay_type,roomstype.name_th,roomstype.bed FROM reserved,customer,payment,roomstype WHERE reserved.cus_id = customer.id AND reserved.payment = payment.id AND reserved.id_typeroom = roomstype.id AND reserved.status = '0'", (err, unconfirm_room) => {
            if (err) throw err;
            res.render('roomconfirmation', { unconfirm_room })
        });
    })
}