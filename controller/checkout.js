require("dotenv").config(); 
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); 
const PDFDocument = require('pdfkit')
const path = require("path")
const fs = require("fs")

const Application = require('../model/application')
const User = require("../model/user")

const fullpath = require('../util/fullpath')



module.exports.getPayment = (req, res) => {
 let appId = req.params.appId
 let application 
 Application.findOne({where: {
    id : appId
 }})
 .then(data => {
    application = data
    return stripe.checkout.sessions.create({
        payment_method_types : ['card'],
        line_items : [{ 
            price_data: { 
              currency: "inr", 
              product_data: { 
                name: 'Course Name: '+ application.course, 
              }, 
              unit_amount: 100
            }, 
            quantity: 1, 
          }, ],
        mode: 'payment',
        success_url : 'http://localhost:5000/users/checkout/success/' + application.id,
        cancel_url  :  'http://localhost:5000/users/checkout/cancel'  
    })
 })
 .then(session => {
    res.render('users/checkout_course', {
        sessionId : session.id ,
        application: application,
        isLoggedIn : req.session.isLoggedIn,
        current_user : req.session.current_user
    })
 })
}




module.exports.getSuccess = (req, res) => {
    let appId = req.params.appId
    Application.findOne({where: {
        id : appId
    }})
    .then(application => {
        application.update({
            payment: 1
        })
        return application.save()
    })
    .then(application => {
        res.render('users/checkout-success.ejs', {application: application, isLoggedIn : req.session.isLoggedIn, current_user : req.session.current_user})
    })
}


module.exports.getCancel = (req, res) => {
    res.send('Your purchase has been canceled. We are sorry for the inconvenient. ')
}


module.exports.getInvoice = (req, res) => {

    const doc = new PDFDocument()

    let current_user = req.session.current_user


    let filename = 'InVoice-' + req.params.appId + '.pdf';
    let filepath = path.join(fullpath, 'public', 'invoice-pdf', filename)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'inline; filename=' + filepath  )

    doc.pipe(fs.createWriteStream(filepath))
    doc.pipe(res)

    Application.findOne({where : {
        id : req.params.appId
    }})
    .then(application => {
  doc.image('/home/sathish/Nodejs/college-admission-system/public/images/Oxford_logo.jpeg'  ,250,20, {
            fit: [100, 100],
            align: 'center',
            valign: 'center'
          });
          doc.fontSize(20).text('The Oxford College of Science',150,120)
          doc.fontSize(14).text('No.32, 17th B Main, Sector IV, HSR Layout Bengaluru 560 102',100,145)
          doc.text('______________________________________________________')
          doc.fontSize(15).fillColor('blue').text("INVOICE", 100, 190)
          
          doc.fontSize(14).fillColor("black").text(`SERIAL NO :`,100,220)
          doc.text(` ${application.id}`, 210,220)
          doc.text(`COURSE :`,100,240)
          doc.text(` ${application.course}`, 210,240)
          doc.text(`FATHER NAME : `,100,260)
          doc.text(` ${application.fatherName}`, 210,260)

          doc.fillColor('blue').text('SL. NO',100,300)
          doc.fillColor('black').text('1. ',100,320)
          doc.text('2. ',100,340)
          doc.text('3. ',100,360)
          doc.text('4. ',100,380)
          doc.text('5. ',100,400)
          doc.text('6. ',100,420)
          doc.text('7. ',100,440)
          doc.text('8. ',100,460)
          doc.text('9.', 100,480)

          doc.fillColor('blue').text('FEE DESCRIPTION',200,300)
          doc.fillColor('black').text('Admission Fee: . ',200,320)
          doc.text('E L G Certification Fee. ',200,340)
          doc.text('Journal Fee. ',200,360)
          doc.text('Laboratory Fee. ',200,380)
          doc.text('MIscelleneous Fee. ',200,400)
          doc.text('Registration Fee. ',200,420)
          doc.text('Sports & Games Fee. ',200,440)
          doc.text('Tuition Fee. ',200,460)
          doc.text('University Fee.', 200,480)

          doc.fillColor('blue').text('AMOUNT', 450,300 )
          doc.fillColor('black').text('1,000. ',450,320)
          doc.text('200. ',450,340)
          doc.text('550. ',450,360)
          doc.text('5,000. ',450,380)
          doc.text('500. ',450,400)
          doc.text('150. ',450,420)
          doc.text('50. ',450,440)
          doc.text('42,000. ',450,460)
          doc.text('550.', 450,480)


          doc.fontSize(15).fillColor('blue').text("TOTAL AMOUNT : ",100,550)
          doc.fontSize(15).fillColor('blue').text('50,000',450,550)

          doc.fontSize(14).fillColor('blue').text('Amount in words: ',100,590 )
          doc.text("INR Fifty Thousand Only ",350,590)


          doc.fontSize(13).fillColor('red').text('NOTE: AMOUNT ONCE PAID CANNOT BE REFUNDED',100,650)


        doc.end()
    })



}

