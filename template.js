var User = require('./user');
var geoip = require('geoip-lite');
 
exports.get = function(req, res) {
    var ip = req.headers['x-forwarded-for'] || '183.82.173.128';
  var geo = geoip.lookup(ip).ll,query;
if(req.query && req.query.search){
    query = {"$and":[{"$or":[{"username": req.query.search },{"place": req.query.search}]},{"incognito":true}]}    
} else{
query = {"$and":[{ geo: { '$near': geo, '$maxDistance': 100.1 } },{"incognito":true}]}
}
  User.find(query, {password:0,geo:0}, function(err, documents) {
    if(err){
      res.send("error.....!");
    }else{
      if(documents){
        req.session.user = documents[0]._id;
      }
      res.render('home', {
        drinks: documents,
        tagline:  "this template data ",
        uplodeBuiten:false
    });
    }
 });
};