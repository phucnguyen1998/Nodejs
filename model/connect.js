var mysql = require('mysql');
 
console.log('Get connection ...');
  
// conn.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

module.exports = {
  conn : mysql.createConnection({
    database: 'nodejs',
    host: "localhost",
    user: "root",
    password: ""
  }) 
};