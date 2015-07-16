var mysql      = require("mysql");
var con = mysql.createConnection({
  host: "10.11.34.174",
  port: "3306",
  user: "root",
  password: "PLATO",
  database: "test"
});

con.connect();
var start = Date.now();
console.log("start: " + start);

con.query("SELECT * from testtable", function(err, rows, fields) {
	if(!err) {
		console.log(rows);
	} else {
		console.log("Error getting response");
	}
	var end = Date.now();
	console.log("end: " + end);
	console.log("time: " + (end - start));
});

con.end();
