const express = require('express');
const session = require('express-session');
const path = require('path');
const pageRouter = require('./routes/pages');
const app = express();
const cookieParser = require('cookie-parser');
const flash = require('req-flash');

app.use(express.urlencoded({extended: false}));

// Serve Static Files


//Templeate Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//cookies
app.use(cookieParser());



//Session
app.use(session({
    secret: '1234',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 1000 * 30
    }
}));

//flash
app.use(flash());

// Routers
app.use('/', pageRouter);

// Error Catch
app.use((req, res, next) =>{
    var err = new Error("Page not found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message);
});

// Setting the server
app.listen(8000, () =>{
console.log('Server is running on port 8000...');
});