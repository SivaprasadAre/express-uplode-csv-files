var csv = require('fast-csv');
var geoip = require('geoip-lite');
var User = require('./user');

exports.post = function(req, res) {
  User.find({username:req.body.username, password:req.body.password}, {password:0,geo:0}, function(err, documents) {
    if(err){
      res.send("error.....!");
    }else{
      if(documents && documents.length > 0){
          req.session.user = documents[0]._id;
          res.locals.user =  documents[0]._id;
        res.render('home', {
          drinks: documents,
          tagline: "you login seces",
          uplodeBuiten:false
      });
      }else{
        res.render('register');
      }
      
    }
 });
};
exports.create = function(req,res){
  var data = req.body;
  var ip = req.headers['x-forwarded-for'] || '183.82.173.128';
  var geoll=geoip.lookup(ip).ll;
  if(data && !(data.lat && data.lag)){
data.lat=geoll[0];
data.lag=geoll[1];
  };
  data.geo = geoll;
  console.log(data);
  User.create(data, function(err, documents) {
    if(err){
      res.send("register error.....!");
    }else{
      res.render('home',{
        drinks: null,
        tagline: "You Register...",
        uplodeBuiten:false
    });
    }
 });
}