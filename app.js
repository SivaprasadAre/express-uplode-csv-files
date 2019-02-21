var express = require('express');
var app = require('express')();
var fileUpload = require('express-fileupload');
var mongoose = require('mongoose');
var ejs = require('ejs')
var session = require('client-sessions');

app.use(fileUpload());
app.use(express.urlencoded());
app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 60 * 60 * 1000,
  activeDuration: 10 * 60 * 1000,
  httpOnly: true,
  secure: true,
  ephemeral: false
}));
 

mongoose.connect('mongodb://localhost:27017/exampledb',{
  useCreateIndex: true,
  useNewUrlParser: true
});
 
app.set('view engine','ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static('./views'));

app.get('/', function(req,res){
  var homeObj = {};
  req.session ={};
  if((req.session && req.session.user)){
    homeObj = {
      drinks: null,
      tagline: null,
      uplodeBuiten:false
  }
  }else{
    homeObj = {
      drinks: null,
      tagline: null,
      uplodeBuiten:true
  }
  }
  res.render('home',homeObj);
});


app.get('/login',function(req,res){
  res.render('login');
});
app.post('/login', require('./login').post);

app.get('/logout',function(req,res){
  req.session.reset();
  res.render('home',{
    drinks: null,
    tagline: null,
    uplodeBuiten:true
});
});

app.get('/register', function(req,res){
  console.log(req.session , req.session.user);
  res.render('register');
});

app.post('/register', require('./login').create);


app.get('/template',function(req,res,next){
  if(req.session && req.session.user){
    next();
  }else{
    res.render('login');
  }
  }, require('./template.js').get);
 
app.post('/upload',function(req,res,next){
if(req.session && req.session.user){
  next();
}else{
  res.render('login');
}
}, require('./upload.js').post);

app.listen(8000);
