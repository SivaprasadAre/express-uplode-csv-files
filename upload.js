var csv = require('fast-csv');
var Users = require('./user');

exports.post = function (req, res) {
    if (!req.files){    return res.status(400).send('No files were uploaded.');
}
    var authorFile = req.files.file;
    console.log(authorFile);
    if(authorFile){
        if(Array.isArray(authorFile)){
            authorFile.forEach(function(value,index){
                var authors = [];
                csv
                 .fromString(value.data.toString(), {
                     headers: true,
                     ignoreEmpty: true
                 })
                 .on("data", function(data){
                     console.log(data);
                     data.geo = [ data.lat, data.lon ];
                     Users.create(data, function(err, documents) {
                         console.log(err,documents)
                        if(err){
                            Users.findOneAndUpdate({username: data.username}, data, { upsert: true },function(err, doc){
                                console.log(err,doc)
                                if(err){
                                    console.log(err);
                                    res.send('Error: Update error....!');
                                }
                            })
                        }
                     });
                 })
                 .on("end", function(){
                     console.log(authors.length);
                 });
                 
            });
        }else{
                var authors = [];
                csv
                 .fromString(authorFile.data.toString(), {
                     headers: true,
                     ignoreEmpty: true
                 })
                 .on("data", function(data){
                     console.log(data);
                     data.geo = [ data.lat, data.lon ];
                     Users.create(data, function(err, documents) {
                        if(err){
                            Users.findOneAndUpdate({username: data.username}, data, { upsert: true },function(err, doc){
                                if(err){
                                    console.log(err);
                                    res.send('Error: Update error....!');
                                }
                            })
                        }
                     });
                 })
                 .on("end", function(){
                     console.log(authors.length);
                 });
        }
    }
    
    res.render('home',{
        drinks: null,
        tagline: "you file uplode....",
        uplodeBuiten:false
    });
};
