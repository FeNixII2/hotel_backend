module.exports = function (app, con, moment) {

    app.get('/reserve', (req, res) => {
        con.query(`select * from listcountry `, (err, listcountry) => {
            if (err) throw err
            con.query(`select * from payment where status_emp = '1' `, (err, payment_type) => {
                if (err) throw err
                con.query(`SELECT main_roomtype_id,name,name_th FROM roomstype GROUP BY main_roomtype_id `, (err, main_type) => {
                    if (err) throw err
                    con.query(`select * from service`, (err, service) => {
                        if (err) throw err
                        res.render(('reserve'), { listcountry, payment_type, main_type, service })
                    })
                })
            })
        })
    })

    app.post('/get_type', (req, res) => {
        var { type } = req.body
        con.query(`SELECT roomstype.id,roomstype.price, roomstype.name, roomstype.name_th ,roomstype.bed, COUNT(roomstype.id) AS count_id
        FROM roomstype
        LEFT JOIN rooms ON roomstype.id = rooms.id_typeroom
        LEFT JOIN reserved ON rooms.num_room = reserved.num_room
        WHERE main_roomtype_id = ${type}
          AND rooms.num_room NOT IN (
            SELECT num_room
            FROM reserved
              where checkin BETWEEN '07-07-2023' AND '08-07-2023'
              AND checkout BETWEEN '07-07-2023' AND '08-07-2023'
              AND STATUS NOT IN(4,5)
          )
        GROUP BY roomstype.id order by roomstype.price asc;
        `, (err, all_in_type) => {
            if (err) throw err
            res.send({ all_in_type })
        })
    })

    app.post('/get_facility', (req, res) => {
        var { id } = req.body
        con.query(`SELECT name FROM roomtype_facility
        LEFT JOIN facility ON roomtype_facility.facility_id = facility.id
        WHERE room_type_id = ${id}`, (err, facility) => {
            if (err) throw err
            con.query(`SELECT * FROM room_service
            LEFT JOIN service ON room_service.service_id = service.id
            WHERE roomtype_id= ${id} `, (err, service) => {
                if (err) throw err
                res.send({ facility, service })
            })
        })
    })

    app.post('/confirm_booking_room', (req, res) => {
        var { firstName, lastName, p_number, email, more_info, payment, checkin, checkout, room_type, totalprice, country, checkboxData } = req.body

        con.query("select id from customer where f_name = ? and l_name = ? and p_num = ? and email = ?", [firstName, lastName, p_number, email], (err, cus_id) => {
            if (err) throw err
            if (cus_id.length != 0) {

                reserv(more_info, payment, checkin, checkout, room_type, cus_id[0].id, totalprice, checkboxData, function (reserved_custom_id) {
                    // console.log("Reserved custom ID:", reserved_custom_id);
                    res.send({ reserved_custom_id })
                });
            } else if (cus_id.length == 0) {
                con.query("insert into customer values ('',?,?,?,?,?)", [firstName, lastName, p_number, email, country], (err, cus_id) => {
                    var cus_id = cus_id.insertId
                    if (err) throw err
                    reserv(more_info, payment, checkin, checkout, room_type, cus_id, totalprice, checkboxData, function (reserved_custom_id) {
                        // console.log("Reserved custom ID:", reserved_custom_id);
                        res.send({ reserved_custom_id })
                    });

                })
            }
        })

    })


    function reserv(more_info, payment, checkin, checkout, room_type, cus_id, totalprice, checkboxData, callback) {
        const currentDate = moment();
        con.query("SELECT num_room FROM rooms WHERE id_typeroom = ? AND num_room NOT IN (SELECT num_room FROM reserved WHERE id_typeroom = ? AND checkin BETWEEN ? AND ? AND checkout BETWEEN ? AND ? AND status NOT IN(4,5)) LIMIT 1", [room_type, room_type, checkin, checkout, checkin, checkout], (err, num_room) => {
            if (err) throw err
            var reserved_custom_date = currentDate.format('DMYYHmm')
            var reserved_custom_id = 'SF' + cus_id + reserved_custom_date
            var booking_date = currentDate.format('DD-MM-YYYY')
            con.query("insert into reserved (num_room,id_typeroom,checkin,checkout,cus_id, more_info, payment,reserved_id,total_price,date,status) values (?,?,?,?,?,?,?,?,?,?,0) ", [num_room[0].num_room, room_type, checkin, checkout, cus_id, more_info, payment, reserved_custom_id, totalprice, booking_date], (err, result) => {
                if (err) throw err
                con.query(`insert into payment_log (reserv_code,total_price,payment_type,status,cus_id,date) values ('${reserved_custom_id}','${totalprice}','${payment}','1','${cus_id}','${booking_date}')`, (err, result) => {
                    if (err) throw err
                    checkboxData.forEach(function (data) {
                        var checkboxId = data.id;
                        var sql = "INSERT INTO reserved_service (reserved_id, service_id ) VALUES (?, ?)";
                        var values = [reserved_custom_id, checkboxId];
                        con.query(sql, values, function (err, result) {
                            if (err) {
                                console.error('Error inserting data: ' + err.stack);
                                return;
                            }
                        });
                    });
                    callback(reserved_custom_id);
                })
            })

        })
    }


}