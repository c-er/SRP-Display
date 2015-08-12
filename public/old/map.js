var socket = io();

var points;

var oldData = {};


socket.on("data_now", function(msg) {
	if(oldData.hashCode != msg.hashCode)
	{
		oldData = msg;
		radioButton();
	}
});

function temp_scalex(x)
{
	return x + 238;
}

function temp_scaley(y)
{
	return y + 15;
}

function drawRows(msg, vendor, scalex, scaley)
{
	for (var i = 0; i < msg["rows"].length; i++) {
		var row = msg["rows"][i];
		if (row.tagvendor == vendor) {
			var xcoord = row["X Coordinate"] + 15;
			var ycoord = row["Y Coordinate"] + 15;
			console.log("x: " + xcoord + " y: " + ycoord);
			var obj = {};
			obj.fillStyle = "#00ffff";
			if(row.felon != 0)
			{
				obj.fillStyle = "#ff0000";
			}
			obj.layer = true;
			obj.groups = [vendor]
			obj.x = scalex(xcoord);
			obj.y = scaley(ycoord);
			obj.width = 15;
			obj.height = 15;
			obj.data = {database: row, hash: msg["hashCode"]};
			obj.click = function(layer) {
				for(var j = 0; j < points.length; j++) {
					points[j].shadowBlur = 0;
				}
				layer.shadowColor = obj.fillStyle;
				layer.shadowBlur = 15;
				$("canvas#map").drawLayers();
				$("#info").empty();
				if(row.medical != null && row.middlename != null && row.photopath != null) {
					$("#info").append("Tag ID: " + row.tagid + "<br>" +"Vendor: " + row.tagvendor + "<br>" + "First Name: " + row.firstname + "<br>" + "Middle Name: " + row.middlename + "<br>" + "Last Name: " + row.lastname + "<br>" + "Address: " + row.address + "<br>" + "Town: " + row.town + "<br>" + "State: " + row.state + "<br>" + "Zip Code: " + row.zip + "<br>" + "Age: " + row.age + "<br>" + "Nationality: " + row.nationality + "<br>" + "Employment: " + row.employment + "<br>" + "Employer: " + row.employer + "<br>" + "Felon: " + row.felon + "<br>" + "Medical Problems: " + row.medical + "<br>" + row.photopath + "<br>" + "X: " + row["X Coordinate"] + "<br>" + "Y: " + row["Y Coordinate"]);
				} else {
					$("#info").append("Tag ID: " + row.tagid + "<br>" +"Vendor: " + row.tagvendor + "<br>" + "First Name: " + row.firstname + "<br>" + "Last Name: " + row.lastname + "<br>" + "Address: " + row.address + "<br>" + "Town: " + row.town + "<br>" + "State: " + row.state + "<br>" + "Zip Code: " + row.zip + "<br>" + "Age: " + row.age + "<br>" + "Nationality: " + row.nationality + "<br>" + "Employment: " + row.employment + "<br>" + "Employer: " + row.employer + "<br>" + "Felon: " + row.felon + "<br>" + "X: " + row["X Coordinate"] + "<br>" + "Y: " + row["Y Coordinate"]);
				}
			}

			$('canvas#map').drawText({
				fillStyle: '#000000',
				layer: true,
				groups: ["RFCode"],
				x: obj.x, y: obj.y + 15,
				fontSize: '9',
				fontFamily: 'Arial',
				text: row.firstname + " " + row.lastname,
				fromCenter: true,
				rotate: 0
			});

			points.push(obj);
			$("canvas#map").drawEllipse(obj);
		}
	}
}



function dataNow(msg)
{
	oldData = msg;
	var rfcode = document.getElementById("court");
	var rooms = document.getElementById("rooms");
	var hallway = document.getElementById("hallway");
	if(rfcode.checked)
	{
		dataNowRFCode(msg);
	}
	else if(rooms.checked)
	{
		dataNowThingMagic(msg);
	}
	else if(hallway.checked)
	{
		dataNowAlien(msg);
	}
}


function dataNowRFCode(msg)
{
	
	points = [];
	var canvas = document.getElementById('map');
	scale();
	$("#info").empty();
	$('canvas').clearCanvas();
	$('canvas#map').removeLayerGroup("thingmagic");
	$('canvas#map').removeLayerGroup("alien");
	//console.log("called");
	//console.log(msg);
	
	$("canvas#map").drawImage({
		source: "FinalBasket.jpg",
		layer: true,
		groups: ["rfcode"],
		x: canvas.width / 2,
		y: canvas.height / 2,
		height: canvas.height - 15,
		width: canvas.height - 15
	});
	$('canvas').drawLayers();
	drawRows(msg, "rfcode", temp_scalex, temp_scaley);
}

function dataNowAlien(msg){
	var canvas = document.getElementById('map');
	points = [];
	scale();
	$("#info").empty();
	$('canvas').clearCanvas();
	$('canvas#map').removeLayerGroup("thingmagic");
	$('canvas#map').removeLayerGroup("rfcode");
	$("canvas#map").drawImage({
		source: "basket.png",
		layer: true,
		groups: ["alien"],
		x: canvas.width / 2,
		y: canvas.height / 2,
		height: canvas.height - 15,
		width: canvas.height - 15
	});
	$('canvas').drawLayers();
	
	console.log(canvas.height - 15);
	drawRows(msg, "alien", temp_scalex, temp_scaley);
}



function dataNowThingMagic(msg){
	points = [];
	scale();
	var canvas = document.getElementById('map');
	$("#info").empty();
	$('canvas').clearCanvas();
	$('canvas#map').removeLayerGroup("alien")
	$('canvas#map').removeLayerGroup("rfcode");
	$("canvas#map").drawImage({
		source: "Devito.jpg",
		layer: true,
		groups: ["thingmagic"],
		x: canvas.width / 2,
		y: canvas.height / 2,
		height: canvas.height - 15,
		width: canvas.height - 15
	});
	//console.log("called");
	//console.log(msg);
	var canvas = document.getElementById('map');
	$('canvas').drawLayers();
	drawRows(msg, "thingmagic", temp_scalex, temp_scaley);
}

function scale()
{
	var canvas = document.getElementById('map');
	canvas.width = window.innerWidth * 0.8;
	canvas.height = window.innerHeight;
}

function radioButton()
{
	dataNow(oldData);
}