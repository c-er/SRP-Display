var socket = io();

socket.on("data_now", dataNow);

var points = [];

function dataNow(msg)
{
	scale();
	$('canvas').clearCanvas();
	//$("#info").empty();
	//$("#info").append("called");
	console.log("called");
	console.log(msg);
	for (var i = 0; i < msg["rows"].length; i++) {
		var row = msg["rows"][i];
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
		obj.x = xcoord;
		obj.y = ycoord;
		obj.width = 15;
		obj.height = 15;
		obj.data = {database: row};
		obj.click = function(layer) {
			for(var j = 0; j < points.length; j++)
  			{
  				points[j].shadowBlur = 0;
  			}
			layer.shadowColor = "#FFFFFF";
  			layer.shadowBlur = 15;
  			$("canvas#map").drawLayers();
  			$("#info").empty();
  			$("#info").append(row.tagid + "<br>" + row.tagvendor + "<br>" + row.firstname + "<br>" + row.middlename + "<br>" + row.lastname + "<br>" + row.address + "<br>" + row.town + "<br>" + row.state + "<br>" + row.zip + "<br>" + row.age + "<br>" + row.nationality + "<br>" + row.employment + "<br>" + row.employer + "<br>" + row.felon + "<br>" + row.medical + "<br>" + row.photopath + "<br>" + row["X Coordinate"] + "<br>" + row["Y Coordinate"]);
		}
		points.push(obj);
		$("canvas#map").drawEllipse(obj);
	};


	// draw the map
}

function scale()
{
	var canvas = document.getElementById('map'),
	context = canvas.getContext('2d');
	canvas.width = window.innerWidth * 0.8;
	canvas.height = window.innerHeight;
}


/*
function test1()
{
	scale();
	$("canvas#map").drawRect({
		layer: true,
		draggable: false,
		fillStyle: "#00ffff",
		x: 0, y: 0,
		width: 200,
		height: 100,
		click: function(layer)
		{
			console.log("called");
			layer.fillStyle="#f0f000";
			$("canvas#map").drawLayers();
			$("div#info").empty();
			$("div#info").append("HELLO");
		}
	});
	

	$("canvas#map").drawRect({
		layer: true,
		draggable: false,
		fillStyle: "#00ffff",
		x: 500, y: 500,
		width: 30,
		height: 30,
		click: function(layer)
		{
			console.log("called");
			layer.fillStyle="#f0f000";
			$("canvas#map").drawLayers();
			$("div#info").empty();
			$("div#info").append("Goodbye");
		}
	});
*/


