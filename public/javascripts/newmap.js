var socket = io();
var points = [];
var oldData = {};
var backs = {};

socket.on("data_now", dataNow);

var currentRadioButton;
var alienPoints = [[], [], [], []];
var layers = [];

var labels = {
	"tagid" : "Tag ID",
	"tagvendor" : "Tag Vendor",
	"firstname" : "First Name",
	"middlename" : "Middle Name",
	"lastname" : "Last Name",
	"address" : "Address",
	"town": "Town",
	"state" : "State",
	"zip": "Zip Code",
	"age": "Age",
	"nationality" : "Nationality",
	"occupation" : "Occupation",
	"employer" : "Employer",
	"medical" : "Medical",
	"felon" : "Special Interest Code",
	"X Coordinate" : "X Coordinate",
	"Y Coordinate" : "Y Coordinate"
}

function once()
{
	scale();
	var canvas = document.getElementById("map");

	backs.rfcode = {
		source: "images/FinalBasket.jpg",
		layer: true,
		visible: false,
		groups: ["rfcode"],
		x: canvas.width / 2,
		y: canvas.height / 2,
		height: canvas.height - 15,
		width: canvas.height - 15
	};

	backs.alien = {
		source: "images/hallway.jpg",
		layer: true,
		visible: false,
		groups: ["alien"],
		scale: (canvas.width - 30)/1091.0,
		x: canvas.width / 2,
		y: canvas.height / 2,
		height: 170,
		width: 1069
	};

	backs.thingmagic = {
		source: "images/rooms.jpg",
		layer: true,
		visible: false,
		groups: ["thingmagic"],
		scale: (canvas.width - 30)/1280.0,
		x: canvas.width / 2,
		y: canvas.height / 2,
		height: 570,
		width: 1068
	};



	$("canvas#map").drawImage(backs.rfcode);
	$("canvas#map").drawImage(backs.alien);
	$("canvas#map").drawImage(backs.thingmagic);

	/*$("canvas").drawImage({
		source: "images/Sid.png",
		layer: true,
		visible: false,
		groups: ["alien"],
		width: 30,
		height: 30,
		x: 200,
		y: 285

	});*/
	//$("canvas#map").drawLayers();
	radioButtonChanged();
}


function scale_x(x) {
	switch(currentRadioButton) {
		case "alien": return alien_scale_x(x);
		case "thingmagic": return thingmagic_scale_x(x);
		case "rfcode": return rfcode_scale_x(x);
		default: return -1;
	}
}

function scale_y(y) {
	switch(currentRadioButton) {
		case "alien": return alien_scale_y(y);
		case "thingmagic": return thingmagic_scale_y(y);
		case "rfcode": return rfcode_scale_y(y);
		default: return -1;
	}
}

function rfcode_scale_x(x) {
	var canvas = document.getElementById("map");
	return x / 30.0 * (backs.rfcode.width - 30) + 0.5 * (canvas.width - backs.rfcode.width) + 15;
}

function rfcode_scale_y(y) {
	var canvas = document.getElementById("map");
	return (30 - y) / 30.0 * (backs.rfcode.height - 30) + 0.5 * (canvas.height - backs.rfcode.height) + 15
}

function alien(x) {
	var canvas = document.getElementById("map");
	var indent = (canvas.width - backs.alien.width) / 2.0;
	switch(x) {
		case 0: return indent;
		case 1: return indent + backs.alien.width / 4.0;
		case 2: return indent + backs.alien.width / 2.0;
		case 3: return indent + backs.alien.width * 3 / 4.0;
	}
	return 0;
}

function alien_scale_x(x) {
	return alien(x);
}

function alien_scale_y(x) {
	var canvas = document.getElementById("map");
	return (canvas.height - backs.alien.height) / 2.0 + 15;
}

function thingmagic_scale_x(x) {
	var canvas = document.getElementById("map");
	return x / 531.0 * (backs.thingmagic.width - 30) + 0.5 * (canvas.width - backs.thingmagic.width) + 15;
}

function thingmagic_scale_y(y) {
	var canvas = document.getElementById("map");
	return y / 287.0 * (backs.thingmagic.height - 30) + 0.5 * (canvas.height - backs.thingmagic.height) + 15;
}

function alienAdd(msg) {
	alienPoints = [[], [], [], []];
	for(var i = 0; i < msg["rows"].length; i++)
	{
		var row = msg["rows"][i];
		//console.log(row);
		if(row.tagvendor == "alien") {
			alienPoints[row["X Coordinate"]].push(row);
		}
	}
}

function dataNow(msg) {
	console.log("datanow");
	//console.log(msg);
	oldData = msg;

	/*var x = 0;
	for(var i = 0; i < msg["rows"].length; i++) {
		if(msg["rows"][i].tagvendor == "alien")
		{
			console.log("YES");
			msg["rows"].splice(i, 1);
		}
	}*/

	//radioButtonChanged();

	alienAdd(msg);

	console.log(msg);
	

	//drawRows(msg, scale_x, scale_y);
	rfcode_draw(msg);

	filter();

	$("canvas").drawLayers();
}

function changeVisible(group, visibility)
{
	for(var i = 0; i < group.length; i++)
	{
		group[i].visible = visibility;
	}
}

function filter()
{
	var alienGroup = $("canvas#map").getLayerGroup("alien");
	var thingmagicGroup = $("canvas#map").getLayerGroup("thingmagic");
	var rfcodeGroup = $("canvas#map").getLayerGroup("rfcode");
	switch(currentRadioButton) {
		case "alien": changeVisible(thingmagicGroup, false); changeVisible(rfcodeGroup, false); changeVisible(alienGroup, true); break;
		case "thingmagic": changeVisible(thingmagicGroup, true); changeVisible(rfcodeGroup, false); changeVisible(alienGroup, false); break;
		case "rfcode": changeVisible(thingmagicGroup, false); changeVisible(rfcodeGroup, true); changeVisible(alienGroup, false); break;
	}
	$("canvas#map").drawLayers();
}

function radioButtonChanged() {
	$("#info").empty();
	var court = document.getElementById("court");
	var rooms = document.getElementById("rooms");
	var hallway = document.getElementById("hallway");
	if(court.checked) {
		currentRadioButton = "rfcode";
	} else if(rooms.checked) {
		currentRadioButton = "thingmagic";
	} else {
		currentRadioButton = "alien";
	}
	filter();
}

function rfcode_draw(msg) {
	var canvas = document.getElementById("map");
	$("canvas").removeLayerGroup("a");
	$("canvas").drawLayers();
	points = [];
	var alienCount = [0, 0, 0, 0];
	for(var i = 0; i < msg["rows"].length; i++)
	{
		var row = msg["rows"][i];
		var obj = {};
		if(row.tagvendor == "rfcode") {
			obj.layer = true;
			obj.groups = ["rfcode", "a"];
			obj.width = obj.height = 30;
			obj.x = rfcode_scale_x(row["X Coordinate"]);
			obj.y = rfcode_scale_y(row["Y Coordinate"]);
			var name = {};
			if(obj.y > backs.rfcode.height / 2) {
				name = {
					fillStyle: '#ffffff',
					layer: true,
					strokeStyle: "#000000",
					strokeWidth: 0.5,
					groups: [row.tagvendor, "a"],
					x: obj.x, y: obj.y - 23,
					fontSize: '9',
					fontFamily: 'Arial',
					text: row.firstname.substring(0, 1) + "." + row.lastname.substring(0, 1) + ".",
					fromCenter: true,
					rotate: 0
				};
			}
			else
			{
				name = {
					fillStyle: '#ffffff',
					layer: true,
					strokeStyle: "#000000",
					strokeWidth: 0.5,
					groups: [row.tagvendor, "a"],
					x: obj.x, y: obj.y + 23,
					fontSize: '9',
					fontFamily: 'Arial',
					text: row.firstname.substring(0, 1) + "." + row.lastname.substring(0, 1) + ".",
					fromCenter: true,
					rotate: 0
				};
			}
			obj.data = {database: row, hash: msg["hashCode"], inits: name};
			var splitted = row.photo.split("\\");
			obj.source = "images/" + splitted[splitted.length - 1].substring(0, splitted[splitted.length - 1].length - 3) + "png";
			obj.click = function(layer) {
				$("#info").empty();
				for(var p in layer.data.database) {
					if(p != null && p != "photo" && p != "readtime" && layer.data.database[p] != null) {
						$("#info").append("<br>" + labels[p] + ": " + layer.data.database[p]);
					}
				}
			}
		}
		else if(row.tagvendor == "alien")
		{
			obj.layer = true;
			obj.groups = ["alien", "a"];
			obj.width = obj.height = 30;
			//console.log(backs.alien.width);
			//obj.x = alien_scale_x(row["X Coordinate"] - 1) + (j % Math.floor(backs.alien.width / 120)) * 30;
			//obj.y = alien_scale_y(row["X Coordinate"]) + (j / Math.floor(backs.alien.width / 120)) * 30;
			obj.x = row["X Coordinate"] * (backs.alien.width / 4) + ((canvas.width - backs.alien.width) / 2) + (backs.alien.width / 8);
			obj.y = backs.alien.y - backs.alien.height / 2 + 50 * alienCount[row["X Coordinate"]]++;
			//obj.x = row["X Coordinate"];
			//obj.x = obj.y = 200;
			var name = {};
			if(obj.y > backs.alien.height / 2) {
				name = {
					fillStyle: '#ffffff',
					layer: true,
					groups: [row.tagvendor, "a"],
					x: obj.x, y: obj.y - 23,
					strokeStyle: "#000000",
					strokeWidth: 0.5,
					fontSize: '9',
					fontFamily: 'Arial',
					text: row.firstname.substring(0, 1) + "." + row.lastname.substring(0, 1) + ".",
					fromCenter: true,
					rotate: 0
				};
			}
			else
			{
				name = {
					fillStyle: '#ffffff',
					layer: true,
					strokeStyle: "#000000",
					strokeWidth: 0.5,
					groups: [row.tagvendor, "a"],
					x: obj.x, y: obj.y + 23,
					fontSize: '9',
					fontFamily: 'Arial',
					text: row.firstname.substring(0, 1) + "." + row.lastname.substring(0, 1) + ".",
					fromCenter: true,
					rotate: 0
				};
			}
			obj.data = {database: row, hash: msg["hashCode"], inits: name};
			var splitted = row.photo.split("\\");
			obj.source = "images/" + splitted[splitted.length - 1].substring(0, splitted[splitted.length - 1].length - 3) + "png";
			obj.click = function(layer) {
				$("#info").empty();
				for(var p in layer.data.database) {
					if(p != null && p != "photo" && p != "readtime" && layer.data.database[p] != null) {
						$("#info").append("<br>" + labels[p] + ": " + layer.data.database[p]);
					}
				}
				//$("#info").append("<br>Tag ID: " + layer.data.database.tagid + "<br>" +"Vendor: " + layer.data.database.tagvendor + "<br>" + "First Name: " + layer.data.database.firstname + "<br>" + "Middle Name: " + layer.data.database.middlename + "<br>" + "Last Name: " + layer.data.database.lastname + "<br>" + "Address: " + layer.data.database.address + "<br>" + "Town: " + layer.data.database.town + "<br>" + "State: " + layer.data.database.state + "<br>" + "Zip Code: " + layer.data.database.zip + "<br>" + "Age: " + layer.data.database.age + "<br>" + "Nationality: " + layer.data.database.nationality + "<br>" + "Employment: " + layer.data.database.employment + "<br>" + "Employer: " + layer.data.database.employer + "<br>" + "Felon: " + layer.data.database.felon + "<br>" + "Medical Problems: " + layer.data.database.medical + "<br>" + layer.data.database.photopath + "<br>" + "X: " + layer.data.database["X Coordinate"] + "<br>" + "Y: " + layer.data.database["Y Coordinate"]);
				
			}
		}
		/*else if(row.tagvendor == "alien") {
			//console.log(row);
			for(var i = 0; i < alienPoints.length; i++) {
				for(var j = 0; j < alienPoints[i].length; j++) {
					console.log("infinite");
					obj.layer = true;
					obj.groups = ["alien"];
					obj.width = obj.height = 30;
					//console.log(backs.alien.width);
					//obj.x = alien_scale_x(row["X Coordinate"] - 1) + (j % Math.floor(backs.alien.width / 120)) * 30;
					//obj.y = alien_scale_y(row["X Coordinate"]) + (j / Math.floor(backs.alien.width / 120)) * 30;
					obj.x = row["X Coordinate"] * (backs.alien.width / 4) + ((canvas.width - backs.alien.width) / 2) + (backs.alien.width / 8);
					obj.y = backs.alien.y - backs.alien.height / 2 + 50 * j;
					//obj.x = row["X Coordinate"];
					//obj.x = obj.y = 200;
					var name = {};
					if(obj.y > backs.alien.height / 2) {
						name = {
							fillStyle: '#ffffff',
							layer: true,
							groups: [row.tagvendor],
							x: obj.x, y: obj.y - 23,
							fontSize: '9',
							fontFamily: 'Arial',
							text: row.firstname.substring(0, 1) + "." + row.lastname.substring(0, 1) + ".",
							fromCenter: true,
							rotate: 0
						};
					}
					else
					{
						name = {
							fillStyle: '#ffffff',
							layer: true,
							groups: [row.tagvendor],
							x: obj.x, y: obj.y + 23,
							fontSize: '9',
							fontFamily: 'Arial',
							text: row.firstname.substring(0, 1) + "." + row.lastname.substring(0, 1) + ".",
							fromCenter: true,
							rotate: 0
						};
					}
					obj.data = {database: row, hash: msg["hashCode"], inits: name};
					var splitted = row.photo.split("\\");
					obj.source = "images/" + splitted[splitted.length - 1].substring(0, splitted[splitted.length - 1].length - 3) + "png";
					obj.click = function(layer) {
						$("#info").empty();
						for(var p in layer.data.database) {
							if(p != null && p != "photo" && p != "readtime" && layer.data.database[p] != null) {
								$("#info").append("<br>" + labels[p] + ": " + layer.data.database[p]);
							}
						}
						//$("#info").append("<br>Tag ID: " + layer.data.database.tagid + "<br>" +"Vendor: " + layer.data.database.tagvendor + "<br>" + "First Name: " + layer.data.database.firstname + "<br>" + "Middle Name: " + layer.data.database.middlename + "<br>" + "Last Name: " + layer.data.database.lastname + "<br>" + "Address: " + layer.data.database.address + "<br>" + "Town: " + layer.data.database.town + "<br>" + "State: " + layer.data.database.state + "<br>" + "Zip Code: " + layer.data.database.zip + "<br>" + "Age: " + layer.data.database.age + "<br>" + "Nationality: " + layer.data.database.nationality + "<br>" + "Employment: " + layer.data.database.employment + "<br>" + "Employer: " + layer.data.database.employer + "<br>" + "Felon: " + layer.data.database.felon + "<br>" + "Medical Problems: " + layer.data.database.medical + "<br>" + layer.data.database.photopath + "<br>" + "X: " + layer.data.database["X Coordinate"] + "<br>" + "Y: " + layer.data.database["Y Coordinate"]);
						
					}
					
				}
			}
			//obj = {data: "not rfcode"};
			//console.log(obj);
		}*/
		else if(row.tagvendor == "thingmagic") {
			obj.layer = true;
			obj.groups = ["thingmagic", "a"];
			obj.width = obj.height = 30;
			obj.x = thingmagic_scale_x(row["X Coordinate"]);
			obj.y = thingmagic_scale_y(row["Y Coordinate"]);
			var name = {};
			if(obj.y > backs.rfcode.height / 2) {
				name = {
					fillStyle: '#ffffff',
					layer: true,
					groups: [row.tagvendor, "a"],
					strokeStyle: "#000000",
					strokeWidth: 0.5,
					x: obj.x, y: obj.y - 23,
					fontSize: '9',
					fontFamily: 'Arial',
					text: row.firstname.substring(0, 1) + "." + row.lastname.substring(0, 1) + ".",
					fromCenter: true,
					rotate: 0
				};
			}
			else
			{
				name = {
					fillStyle: '#ffffff',
					layer: true,
					strokeStyle: "#000000",
					strokeWidth: 0.5,
					groups: [row.tagvendor, "a"],
					x: obj.x, y: obj.y + 23,
					fontSize: '9',
					fontFamily: 'Arial',
					text: row.firstname.substring(0, 1) + "." + row.lastname.substring(0, 1) + ".",
					fromCenter: true,
					rotate: 0
				};
			}
			obj.data = {database: row, hash: msg["hashCode"], inits: name};
			var splitted = row.photo.split("\\");
			obj.source = "images/" + splitted[splitted.length - 1].substring(0, splitted[splitted.length - 1].length - 3) + "png";
			obj.click = function(layer) {
				$("#info").empty();
				for(var p in layer.data.database) {
					if(p != null && p != "photo" && p != "readtime" && layer.data.database[p] != null) {
						$("#info").append("<br>" + labels[p] + ": " + layer.data.database[p]);
					}
				}
			}
		}
		else
		{
			obj = {data: "not rfcode"};
		}
		points.push(obj);
		//console.log(obj);
		//$("canvas").drawImage(obj);
	}
	for(var i = 0; i < points.length; i++)
	{
		if(points[i] != null) {
			$("canvas").drawImage(points[i]);
			$("canvas").drawText(points[i].data.inits);
		}
	}
}

function drawRows(msg, scalex, scaley)
{
	console.log(msg);
	var canvas = document.getElementById("map");
	points = [];
	for (var i = 0; i < msg["rows"].length; i++) {
		var row = msg["rows"][i];
		
		var xcoord = row["X Coordinate"];
		var ycoord = row["Y Coordinate"];
		var obj = {};
		obj.fillStyle = "#00ffff";
		if(row.felon != 0)
		{
			obj.fillStyle = "#ff0000";
		}
		obj.layer = true;
		obj.groups = [row.tagvendor];
		obj.x = scalex(xcoord);
		obj.y = scaley(ycoord);
		var splitted = row.photo.split("\\");
		obj.source = "images/" + splitted[splitted.length - 1].substring(0, splitted[splitted.length - 1].length - 3) + "png";
		//console.log(obj.source);
		obj.width = 30;
		obj.height = 30;
		obj.data = {database: row, hash: msg["hashCode"]};
		//if(row.lastname == "Kelly") continue;
		if(row.tagvendor == "alien") {
			//console.log(row);
			for(var i = 0; i < alienPoints.length; i++) {
				for(var j = 0; j < alienPoints[i].length; j++) {
					obj.x = scalex(xcoord - 1) + (j % floor(backs.alien.width / 120)) * 30;
					obj.y = scaley(ycoord) + (j / floor(backs.alien.width / 120)) * 30;
				}
			}
		}
		obj.click = function(layer) {
			for(var j = 0; j < points.length; j++) {
				points[j].shadowBlur = 0;
			}
			layer.shadowColor = "#ff0000";
			layer.shadowBlur = 20;
			$("canvas#map").drawLayers();
			$("#info").empty();
			
			if(row.medical != null && row.middlename != null && row.photo != null) {
				$("#info").append("Tag ID: " + layer.data.database.tagid + "<br>" +"Vendor: " + layer.data.database.tagvendor + "<br>" + "First Name: " + layer.data.database.firstname + "<br>" + "Middle Name: " + layer.data.database.middlename + "<br>" + "Last Name: " + layer.data.database.lastname + "<br>" + "Address: " + layer.data.database.address + "<br>" + "Town: " + layer.data.database.town + "<br>" + "State: " + layer.data.database.state + "<br>" + "Zip Code: " + layer.data.database.zip + "<br>" + "Age: " + layer.data.database.age + "<br>" + "Nationality: " + layer.data.database.nationality + "<br>" + "Employment: " + layer.data.database.employment + "<br>" + "Employer: " + layer.data.database.employer + "<br>" + "Felon: " + layer.data.database.felon + "<br>" + "Medical Problems: " + layer.data.database.medical + "<br>" + layer.data.database.photopath + "<br>" + "X: " + layer.data.database["X Coordinate"] + "<br>" + "Y: " + layer.data.database["Y Coordinate"]);
			} else {
				$("#info").append("Tag ID: " + layer.data.database.tagid + "<br>" +"Vendor: " + layer.data.database.tagvendor + "<br>" + "First Name: " + layer.data.database.firstname + "<br>" + "Last Name: " + layer.data.database.lastname + "<br>" + "Address: " + layer.data.database.address + "<br>" + "Town: " + layer.data.database.town + "<br>" + "State: " + layer.data.database.state + "<br>" + "Zip Code: " + layer.data.database.zip + "<br>" + "Age: " + layer.data.database.age + "<br>" + "Nationality: " + layer.data.database.nationality + "<br>" + "Employment: " + layer.data.database.employment + "<br>" + "Employer: " + layer.data.database.employer + "<br>" + "Felon: " + layer.data.database.felon + "<br>" + "X: " + layer.data.database["X Coordinate"] + "<br>" + "Y: " + layer.data.database["Y Coordinate"]);
			}
		}

		if(obj.y < canvas.height / 2) {
			$('canvas#map').drawText({
				fillStyle: '#ffffff',
				layer: true,
				groups: [row.tagvendor],
				x: obj.x, y: obj.y + 23,
				fontSize: '9',
				fontFamily: 'Arial',
				text: row.firstname.substring(0, 1) + "." + row.lastname.substring(0, 1) + ".",
				fromCenter: true,
				rotate: 0
			});
		} else {
			$('canvas#map').drawText({
				fillStyle: '#ffffff',
				layer: true,
				groups: [row.tagvendor],
				x: obj.x, y: obj.y - 23,
				fontSize: '9',
				fontFamily: 'Arial',
				text: row.firstname.substring(0, 1) + "." + row.lastname.substring(0, 1) + ".",
				fromCenter: true,
				rotate: 0
			});
		}

		

		points.push(obj);
		$("canvas#map").drawImage(obj);

	}
}

function scale()
{
	var canvas = document.getElementById('map');
	canvas.width = window.innerWidth * 0.8;
	canvas.height = window.innerHeight;
}