'use strict';

var express = require("express"),
    app = express(),
    router = express.Router(),
    mysql   = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'confirmtkt',
  database : 'test'
});
app.use('/api', router);
connection.connect(function(err){
if(!err) {
    console.log("Connection to database successfully.!!");    
} else {
    console.log("Database Connection Error.");    
}});


router.get('/search', function(req, res){
   var input = req.query.q.toLowerCase();
   var searchQuery = 'SELECT * from full_name where LOWER(first_name) like "%' + input 
                    + '%" or LOWER(last_name) like "%' + input +'%" LIMIT 5';
   if(input.length < 3) { res.status(500).send("Please provide atleast 3 characters."); }
   else {
    connection.query(searchQuery, function(err, rows, fields) {
     if (!err){
  	   res.setHeader('Content-Type', 'application/json');
       res.send(rows);
     }
     else
     	res.send('No result found.');
     });
   }
});

function exitHandler(options, err) {
    connection.end();
    if (options.cleanup)
        console.log('clean');
    if (err)
        console.log(err.stack);
    if (options.exit)
        process.exit();
}
process.on('exit', exitHandler.bind(null, {cleanup: true}));

var server = app.listen(3000, '0.0.0.0', function() {
  console.log('Server is running.');
 });