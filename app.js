var express = require('express');
var { MongoClient, ObjectId } = require('mongodb');
const connection = require('./dbConnection.js');
const session = require('express-session');
var app = express();
var path = require('path');


app.use((req, res, next) => {
    res.locals.url = req.originalUrl;
    res.locals.host = 'http://localhost:3000/';
    res.locals.protocol = req.protocol;

    next();
});
global.__basedir = __dirname;


var indexRouter = require('./routes/index');



var api = require('./routes/api');




app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/static', express.static(path.join(__dirname, '/public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));


app.use('/', indexRouter);
app.use('/signupform', indexRouter);


app.use('/login', api);
app.use('/api', api);



app.listen(3000, function () {
    console.log(`Example app listening on port 3000!`);
  });


module.exports = app;
