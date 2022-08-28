const express = require('express')
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const passport = require('passport')
// const MongoDbStore = require('connect-mongo')(session)

const PORT = process.env.PORT || 3000;
const app = express();


// Database connection
const url = 'mongodb://localhost/authentication'
mongoose.connect(url, {
    useNewUrlParser: true, 
    // useCreateIndex: true, - not supported in new version
    // useUnidfiedTopology: true,  - not supported in new version
    // useFindAndModify: true  - not supported in new version
})

const connection = mongoose.connection;
connection.once('open', () =>{
    console.log('Database connected...')
})
connection.on('error', () => {
    console.log('Connection failed!')
})

// Session store
// let mongoStore = new MongoDbStore({
//     mongooseConnection: connection,
//     collection: 'sessions'
// })

// Session config
app.use(session({
    secret: "secret",
    resave: false,
    // store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}))

// Use passport(Authentication)
const passportInit = require('./config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


app.use(flash())

// Assets
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Add Globla variable
app.use((req,res,next)=>{
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})


// Set template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/public/views'));
app.set('view engine', 'ejs');

require('./routes/router')(app);

// Server
app.listen(PORT, ()=> {
    console.log(`server is listenin on ${PORT}`)
})