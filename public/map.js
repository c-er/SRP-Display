var socket = io();

socket.on("data_now", dataNow);

function dataNow(msg)
{
	scale();
	$('canvas').clearCanvas();
	$("#info").empty();
	$("#info").append("called");
	console.log("called");
	console.log(msg);
	for (var i = 0; i < msg["rows"].length; i++) {
		var xcoord = msg["rows"][i]["X(location)"] + 15;
		var ycoord = msg["rows"][i]["Y(location)"] + 15;
		console.log("x: " + xcoord + " y: " + ycoord);
		/*var obj = {};
		obj.fillStyle = "#00ffff";
		obj.x = xcoord;
		obj.y = ycoord;
		obj.width = 15;
		obj*/
		$('canvas#map').drawEllipse({
			data: {
				msg["rows"][i]
			}
			fillStyle: "#00ffff",
			x: xcoord, y: ycoord,
			width: 15, height: 15
		})
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


