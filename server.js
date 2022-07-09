const express = require('express')
const dotenv = require('dotenv')
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
const fileUpload = require('express-fileupload')
const flash = require('express-flash')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const connectDB = require('./config/db')
const helpers = require('./utils/hbsHelpers')
const cors = require('cors')

// init env variables
dotenv.config()

const app = express()
app.use(fileUpload())
app.use(cors())

const store = new MongoStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
})

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false}))

helpers(Handlebars)

app.use(session({
    secret: process.env.SECRET_KEY,
    store: store,
    resave: true,
    saveUninitialized: true
}))

app.use(flash())

// Create static public folder
app.use(express.static('public'))

// Set hbs shablonizator
app.engine('hbs', exphbs({extname: 'hbs'}))
app.set('view engine', 'hbs')

app.use('/', require('./routes/homeRoutes'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/admin', require('./routes/postRoutes'))

// api/v1/home
app.use('/api/v1/auth', require('./routes/apiRoutes/api.auth.routes'))
app.use('/api/v1', require('./routes/apiRoutes/api.home.routes'))
app.use('/api/v1/admin/', require('./routes/apiRoutes/api.admin.routes'))

// not found
app.get('*', (req, res) => {
    res.render('404/error', {
        title: 'Error page'
    })
})

connectDB()

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})
