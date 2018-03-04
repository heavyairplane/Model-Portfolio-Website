var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var nodemailer = require('nodemailer');
var fs = require('fs');
var config = require('./config.js');


const router = express.Router();
const validator = require('express-validator');
const { check, validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const helmet = require('helmet');
const csrf = require('csurf');
const PORT = process.env.PORT || 3000;

/* encryption stuff
const https = require("https"),
  fs = require("fs");
  */

var name = "Sandra Agudosi";

let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 25,
    auth: {
        user: config.email,
        pass: config.password
    },
    tls: {
        rejectUnauthorized: false
    }
});


//View engine
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

//body Parser middle ware
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
    secret: 'super-secret-key',
    key: 'super-secret-cookie',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
  }));
app.use(flash());
app.use(csrf({ cookie: true }));

//use validator
app.use(validator());

//use stuff
app.use(express.static(__dirname + '/public'));

//Set static path
app.use(express.static(path.join(__dirname,'public')));




app.get('/', function(req,res){
    res.render('index', {
      title: name
    });
});

app.get('/portfolio', function(req,res){
    res.render('index', {
      title: name + ' - Portfolio'
    });
});
app.get('/about', function(req,res){
    res.render('routes/about', {
      title: name + ' - About'
    });
});

app.get('/contact', function(req,res,err){
    res.render('routes/contact' , {
      title: name + ' - Contact',
      data: {},
      errors: {},
      csrfToken: req.csrfToken()
    });
});

app.get('/contact-after', function(req,res){
    res.render('routes/contact-after', {
      title: name + ' - Thank You'
    });
});


//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
       console.log("error 404");
  res.status(404).send("error");
});

app.post('/contact', [
  check('name')
    .trim(),
    check('email')
      .isEmail()
      .withMessage('That email doesn‘t look right')
      .trim()
      .normalizeEmail(),
  check('message')
    .isLength({ min: 1})
    .withMessage('Message is required')
    .trim(),

], function(req, res) {
   const errors = validationResult(req);
  //  console.log("Post Attempting");

    if (!errors.isEmpty()) {
      return res.render('routes/contact', {
        title:  name + ' - Contact',
        data: req.body,
        errors: errors.mapped(),
        csrfToken: req.csrfToken()
      })
    }
 const data = matchedData(req)
 console.log('Sanitized: ', data)

 let HelperOptions = {
     from: '"Joshua Oseh" <joshuaoseh@gmail.com>',
     to: 'joshuaoseh@gmail.com',
     subject: 'Website Contact from ' + data.email,
     text: data.message + "\n \n From: " + data.name
 };


 transporter.sendMail(HelperOptions, (error, info) => {
  if(error){
   return  console.log(error);
     }

     console.log("message sent");
     console.log(info);
 });

 req.flash('success', 'Thanks for the message! I‘ll be in touch :)');
 res.redirect('/contact-after');

});

//error handling go to home
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).render('index',{
    title: name + ' - Portfolio'
  });
})

/*
//Global vars
app.use(function(req,res,next){
    res.locals.config = '7b2147a64dd1b7c734a19b13fc85d6a6';
    next();
});
*/

app.listen(PORT, function(){
    console.log('Server running on Port ' + PORT + "...");
})
