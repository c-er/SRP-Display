var socket = io();

socket.on("data_now", dataNow);

function dataNow(msg)
{
	// draw the map
}

function scale()
{
	var canvas = document.getElementById('map'),
	context = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}



function test1()
{
	scale();
	$("canvas#map").drawRect({
		layer: true,
		draggable: false,
		fillStyle: "#00ffff",
		x: 150, y: 100,
		width: 200,
		height: 100,
		click: function(layer)
		{
			console.log("called");
			layer.fillStyle="#f0f000";
			$("canvas#map").drawLayers();
		}
	});
	
}

