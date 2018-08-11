const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');

//init app
const app = express();

//set the view engine: pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

//express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

//express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Setting database
mongoose.connect('mongodb://moviedb:1256rs@ds119442.mlab.com:19442/user-movieapp', { useNewUrlParser: true })
  .then(() => console.log('Connected to database'))
  .catch(err => console.log(err));

//route to index
app.get('/', function (req, res){
  res.render('index');
});
//OTHER ROUTES
var signup = require('./routes/usersReg');
app.use('/signup', signup);

const port = 8080;
app.listen(port, function(){
  console.log(`Server started on ${port}`);
});
