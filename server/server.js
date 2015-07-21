var mysql = require("mysql");
var http = require("http");
var express = require("express");
var hash = require("object-hash");
var socketio = require("socket.io");
var app = express();

var con = mysql.createConnection({
  host: "10.11.34.174",
  port: "3306",
  user: "root",
  password: "PLATO",
  database: "test"
});

var schedule;

var cache = {};

var data = {};

con.connect();

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/../public/index.html");
});

var server = http.createServer(app);

server.listen(3000, function() {
	console.log("listening on port 3000");
});

var io = socketio(server);

function updateData(query)
{
	con.query(query, function(err, rows, fields) {
		console.log("called");
		if(!err) {
			cache["rows"] = rows;
			cache["hashCode"] = hash.sha1(rows);
			if(cache["hashCode"] != data["hashCode"]) {
				data = cache;
				io.emit("data_change", data);
			}
		} else {
			console.log("error getting data from database");
		}
	});
}

io.on("connection", function(socket) {
	console.log("connection received");
	data["rows"] = [];
	data["hashCode"] = "";
	schedule = setInterval(updateData, 1000, "SELECT * from testtable");
	socket.on("data_change", function(msg) {
		console.log("Data: " + msg.rows);
		console.log("Hash: " + msg.hashCode); 
	});
});





/*con.query("SELECT * from testtable", function(err, rows, fields) {
	if(!err) {
		data = rows;
		console.log(rows);
	} else {
		console.log("Error getting response");
	}
});*/

con.end();
