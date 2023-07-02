module.exports = function (app, con, transporter, fs, path, pdf, moment) {
    app.get('/indexroomconfirmation', (req, res) => {
        if (req.session.emp_pos == 2) {
            con.query(`SELECT reserved.id'reserv_id', reserved.*,customer.*,payment.pay_type,roomstype.name_th,roomstype.bed FROM reserved
            LEFT JOIN customer on reserved.cus_id = customer.id
            LEFT JOIN  payment on reserved.payment = payment.id
            LEFT JOIN roomstype on reserved.id_typeroom = roomstype.id
            WHERE reserved.status = '0'`, (err, unconfirm_room) => {
                if (err) throw err;
                res.render('roomconfirmation', { unconfirm_room })
                // console.log(unconfirm_room);
            });
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

    app.post('/confirmroom', (req, res) => {
        var { id } = req.body
        // console.log(id);
        var reserv_id = id
        con.query("select * from reserved,customer,payment,roomstype where reserved.id_typeroom = roomstype.id and reserved.payment = payment.id and reserved.cus_id = customer.id and reserved.id = ?", [id], (err, id) => {
            var id = id[0]
            const checkin = moment(id.checkin, 'DD-MM-YYYY');
            const checkout = moment(id.checkout, 'DD-MM-YYYY');
            const numberOfDays = checkout.diff(checkin, 'days');
            // console.log(numberOfDays);
            var price = id.price * numberOfDays
            con.query("update reserved set status = '1' where id = ?", [reserv_id], (err, result) => {
                const html = `<!DOCTYPE html>
            <html>

            <head>
                <title>Hotel Reservation Receipt</title>
                <style>
                    body {
                        padding: 20px;
                    }
                </style>
                <link rel="stylesheet" href="main.css">
                <script src="bootstrap.bundle.min.js"></script>
            </head>

            <body>
            <center>
                <div class="container">
                    <div class="text-center mb-4">
                        <img >
                    </div>

                    <h1 class="text-center">HOTEL RESERVATION RECEIPT</h1>

                    <table class="table table-striped">
                        <tr>
                            <th colspan="2">Reservation Details:</th>
                        </tr>
                        <tr>
                            <td>Reservation Number:</td>
                            <td>${id.reserved_id}</td>
                        </tr>
                        <!-- <tr>
                            <td>Booking Date:</td>
                            <td>[Booking Date]</td>
                        </tr> -->
                        <tr>
                            <td>Check-in Date:</td>
                            <td>${id.checkin}</td>
                        </tr>
                        <tr>
                            <td>Check-out Date:</td>
                            <td>${id.checkout}</td>
                        </tr>
                       <!-- <tr>
                            <td>Number of Guests:</td>
                            <td>[Number of Guests]</td>
                        </tr> -->
                        <tr>
                            <td>Room Type:</td>
                            <td>${id.name}(${id.name_th})</td>
                        </tr>
                    </table>

                    <table class="table table-striped">
                        <tr>
                            <th colspan="2">Guest Information:</th>
                        </tr>
                        <tr>
                            <td>Guest Name:</td>
                            <td>${id.f_name} ${id.l_name}</td>
                        </tr>
                        <tr>
                            <td>Contact Number:</td>
                            <td>${id.p_num}</td>
                        </tr>
                        <tr>
                            <td>Email Address:</td>
                            <td>${id.email}</td>
                        </tr>
                    </table>

                    <table class="table table-striped">
                        <tr>
                            <th colspan="2">Hotel Details:</th>
                        </tr>
                        <tr>
                            <td>Hotel Name:</td>
                            <td>BS Hotel</td>
                        </tr>
                        <tr>
                            <td>Hotel Address:</td>
                            <td>[Hotel Address]</td>
                        </tr>
                        <tr>
                            <td>Hotel Contact:</td>
                            <td>053456789</td>
                        </tr>
                    </table>

                    <div class="card">
                        <div class="card-header">
                            <h2 class="mb-0">PAYMENT DETAILS</h2>
                        </div>
                        <!--<div class="card-body">
                            <table class="table">
                                <tr>
                                    <th colspan="2">Room Charges:</th>
                                </tr>
                                <tr>
                                    <td>Room Rate per Night:</td>
                                    <td>[Room Rate]</td>
                                </tr>
                                <tr>
                                    <td>Number of Nights:</td>
                                    <td>[Number of Nights]</td>
                                </tr>
                                <tr>
                                    <td>Subtotal:</td>
                                    <td>[subtotal]</td>
                                </tr>
                            </table>-->

                            <!--   <table class="table">
                                <tr>
                                    <th colspan="2">Taxes and Fees:</th>
                                </tr>
                                <tr>
                                    <td>Service Charge:</td>
                                    <td>[Service Charge]</td>
                                </tr>
                                <tr>
                                    <td>Tax:</td>
                                    <td>[Tax]</td>
                                </tr>
                                <tr>
                                    <td>Total Taxes and Fees:</td>
                                    <td>[Total Taxes and Fees]</td>
                                </tr>
                            </table> -->

                            <table class="table">
                                <tr>
                                    <th>Total Amount Paid:</th>
                                    <td>${id.total_price}</td>
                                </tr>
                                <tr>
                                    <th>Payment Method:</th>
                                    <td>${id.pay_type}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    </center>
                    <p class="mt-4">Thank you for choosing our hotel for your stay. If you have any questions or need further assistance, please don't hesitate to contact us using the information provided above.</p>

                    <p>We hope you have a pleasant stay!</p>
                </div>

            </body>

            </html>`
                // Create a PDF from the HTML
                const directoryPath = path.join(__dirname, '..', 'receipt');

                pdf.create(html, {}).toFile(path.join(directoryPath, 'receipt' + id.reserved_id + '.pdf'), function (err, res) {
                    if (err) return console.log(err);
                    // console.log('PDF created successfully.');

                    // Prepare email data
                    const mailOptions = {
                        from: 'testinghotel9@gmail.com',
                        to: id.email,
                        subject: 'Hotel Reservation Receipt',
                        html: '<p>ใบเสร็จการจองห้องพัก</p>',
                        attachments: [{
                            filename: 'receipt.pdf',
                            path: path.join(directoryPath, 'receipt' + id.reserved_id + '.pdf'),
                            contentType: 'application/pdf'
                        }]
                    };

                    // Send email with attached PDF
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            // console.log('Email sent successfully:', info.response);

                            // Delete the PDF file after sending email
                            // fs.unlinkSync(path.join(__dirname, 'receipt' + id.reserved_id + '.pdf'));
                            // console.log('PDF file deleted successfully.');
                        }
                    });
                });

                res.send({})
            })
        })
    })

    app.post('/cancelroom', (req, res) => {
        var { id } = req.body
        console.log(id);
        con.query("update reserved set status = '5' where id = ?", [id], (err, result) => {
            if (err) throw err
            res.send({})
        })
    })
}