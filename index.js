//#region Declarações
const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')
const authRoutes = require('./routes/authRoutes')
const app = express()
//#endregion

//#region setUp da aplicação
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'))
//#endregion

const conn = require('./db/conn')
const Thought = require('./models/Thought')
const User = require('./models/User')

//region Rotas de controle
app.use('/', authRoutes)
//endregion

//region Controle de Sessão
app.use(
    session({
        name: 'session',
        secret: 'nosso_secret',
        saveUninitialized: false,
        store: new FileStore({
            logFn: function(){},
            path: require('path').join(require('os').tmpdir(), 'sessions')
        }),
        cookie: {
            secure: false,
            maxAge: 3600000,
            expires: new Date(Date.now() + 3600000),
            httpOnly: true
        }
    })
)

app.use(flash())
app.use((req, res, next) => {
    console.log(req.session.userid)

    if(req.session.userid){
        res.locals.session = req.session
    }

    next()
})
//endregion

conn
.sync()
.then(() => {
    app.listen(3000)
})
.catch((error) => console.error(error))