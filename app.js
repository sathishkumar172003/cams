
// modules
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const bcrypt = require('bcryptjs')
const path = require('path')
const flash = require('connect-flash')
const nodemailer = require("nodemailer");

// custom modules
const userRoutes  = require('./routes/userRoutes')
const collegeRoutes = require('./routes/collegeRoutes')
const adminRoutes = require('./routes/adminRoutes')
const errorController = require('./controller/error')
const appRouter = require('./routes/applicationRoutes')


// sequelize object
const sequelize = require('./util/database')


//sequelize models
const User  = require('./model/user')
const Application = require('./model/application')




var store = new SequelizeStore({
    db: sequelize,
    // table: 'Sessions' // use it only when you have a predefined Session table set up , if not then omit this options 
})

let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "1614811",
      pass: "sathishkumar17"
    }
}
)


const app = express()

app.use(bodyParser.urlencoded({extended:false})) //registering bodyParser with middle ware
app.use(express.static(path.join(__dirname, '/public'))); //middleware to serve static files
app.set('view engine', 'ejs'); //setting the ejs templates 
app.set('views', 'views'); //explicitly setting the views folder for ejs
app.use(morgan('dev')) //third party package for displaying request information
app.use(cookieParser()) //use the cookieParser in our application 

app.use(session({secret: 'thisIsLogInMessage', resave: false, saveUninitialized: false,    store: store })) // setting up the cookie 
app.use(flash())





// routes
app.use( '/users',userRoutes);
app.use('/admin', adminRoutes)
app.use("/applications", appRouter)
app.use(collegeRoutes)
app.use(errorController.pageNotFound)


// home associtions 
User.hasMany(Application)
Application.belongsTo(User, {constraints:true, onDelete: 'CASCADE'})






// sequelize.sync({alter:true})
sequelize.sync()
.then((result) => {
    app.listen(5000, () => {
        console.log('server running on machine 5000')
    })
})
.catch(err => console.log(err))



