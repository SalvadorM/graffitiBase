const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

const config = require('./config/datab');

//init app
const app = express();

//Setting database
mongoose.connect(config.database, { useNewUrlParser: true })
  .then(() => console.log('Connected to database'))
  .catch(err => console.log(err));

//set the view engine: pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

//express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

//express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//express passport
require('./config/passportConfig')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

//route to index
app.get('/', function (req, res){
  res.render('index');
});

//users route
var user = require('./routes/usersReg');
app.use('/users', user);



const port = 8080;
app.listen(port, function(){
  console.log(`Server started on ${port}`);
});
