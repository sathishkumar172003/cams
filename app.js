
// modules
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store);



const path = require('path')


// sequelize object
const sequelize = require('./util/database')


//sequelize models
const User  = require('./model/user')


// custom modules
const userRoutes  = require('./routes/userRoutes')
const collegeRoutes = require('./routes/collegeRoutes')
const errorController = require('./controller/error')
const Application = require('./model/application')


var store = new SequelizeStore({
    db: sequelize,
    // table: 'Sessions' // use it only when you have a predefined Session table set up , if not then omit this options 
})


const app = express()

app.use(bodyParser.urlencoded({extended:false})) //registering bodyParser with middle ware
app.use(express.static(path.join(__dirname, '/public'))); //middleware to serve static files
app.set('view engine', 'ejs'); //setting the ejs templates 
app.set('views', 'views'); //explicitly setting the views folder for ejs
app.use(morgan('dev')) //third party package for displaying request information
app.use(cookieParser()) //use the cookieParser in our application 

app.use(session({secret: 'thisIsLogInMessage', resave: false, saveUninitialized: false,    store: store ,cookie: {      maxAge: 110000}})) // setting up the cookie 
 




// routes
app.use( '/users',userRoutes);
app.use(collegeRoutes)
app.use(errorController.pageNotFound)


// home associtions 
User.hasOne(Application)
Application.belongsTo(User, {constraints:true, onDelete: 'CASCADE'})






// sequelize.sync({alter:true})
sequelize.sync()
.then((result) => {
    app.listen(5000, () => {
        console.log('server running on machine 5000')
    })
})
.catch(err => console.log(err))



