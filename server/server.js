var mysql = require("mysql");
var hash = require("object-hash");
var express = require("express");
var app = require("express")();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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

data["rows"] = [];
data["hashCode"] = "";

function updateData(query)
{
	con.query(query, function(err, rows, fields) {
		//console.log("called");
		if(!err) {
			cache["rows"] = rows;
			cache["hashCode"] = hash.sha1(rows);
			//console.log(cache);
			if(cache["hashCode"] != data["hashCode"]) {
				data = cache;
				io.emit("data_change", data);
				console.log("fired");
			}
		} else {
			console.log("error getting data from database");
		}
	});
}

io.on('connection', function(socket) {
	console.log("connection received");
	io.emit("data_change", data);
	schedule = setInterval(updateData, 1000, "SELECT * from testtable");
	socket.on("data_change", function(msg) {
		console.log("Data: " + msg.rows);
		console.log("Hash: " + msg.hashCode); 
	});
});

app.get("/", function(req, res) {
	console.log("get " + __dirname);
	res.sendFile(__dirname + "/index.html");
});

http.listen(3000, function(){
  	console.log('listening on *:3000');
});

//con.end();