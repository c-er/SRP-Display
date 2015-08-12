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
  database: "shelter_mac"
});

var schedule;

var cache = {};

var data = {};

con.connect();

data["rows"] = [];
data["hashCode"] = "";

var queries = {
	mostRecent: "SELECT b.*, a.readtime, X(a.location) AS \"X Coordinate\", Y(a.location) AS \"Y Coordinate\"  FROM locations a INNER JOIN shelteree b ON b.tagid = a.tagid AND b.tagvendor = a.tagvendor AND a.readtime = (SELECT MAX(readtime) FROM locations WHERE tagid=a.tagid);",
	all: "SELECT * FROM tagreads",
	atTime: function(unixTime) {
		return "SELECT * from tagreads where abs(UNIX_TIMESTAMP(readtime) - " + unixTime + ")=(" + 
				"SELECT min(abs(" + unixTime + "-UNIX_TIMESTAMP(readtime))) from tagreads);";
	}
};

dataNow();
schedule = setInterval(dataNow, 1000);

function dataNow()
{
	cache = {};
	con.query(queries.mostRecent, function(err, rows, fields) {
		if(!err) {
			//console.log(rows);
			cache["rows"] = rows;
			cache["hashCode"] = hash.sha1(rows);
			if(cache["hashCode"] != data["hashCode"]) {
				data = JSON.parse(JSON.stringify(cache));
				io.emit("data_now", data);
			}
		} else {
			console.log("error getting data from database");
		}
	});
}

function clientSpecial(query, socket) {
	var ret = {};
	console.log(query);
	con.query(query, function(err, rows, fields) {
		//console.log("called");
		if(!err) {
			ret["rows"] = rows;
			ret["hashCode"] = hash.sha1(rows);
			console.log("queried");
		} else {
			console.log("error getting data from database");
			ret = null;
		}
		socket.emit("data_special", ret);
	});
}

function clientTime(time, socket) {
	var ret = {};
	con.query(queries.atTime(time), function(err, rows, fields) {
		if(!err) {
			ret["rows"] = rows;
			ret["hashCode"] = hash.sha1(rows);
			console.log("queried");
		} else {
			console.log("error getting data from database");
			ret = null;
		}
		socket.emit("data_time", ret);
	});
}

io.on('connection', function(socket) {

	console.log("connection received");
	
	if(data["hashCode"] != "")
	{
		socket.emit("data_now", data);
	}

	socket.on("client_time", function(msg) {
		clientTime(msg["time"], socket);
	});

	socket.on("client_special", function(msg) {
		clientSpecial(msg["query"], socket);
	});
});

app.use(express.static("public"))

http.listen(3000, function(){
  	console.log('listening on *:3000');
});