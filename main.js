var c = document.getElementById("myCanvas");
var info = document.getElementById("info");
info.innerHTML = "Place 3 pointers to see information here.";
c.width = window.innerWidth;
c.height = window.innerHeight;
var ctx = c.getContext("2d");
var count = 0;
var shapes = [];
var myState = this;

function on() {
	document.getElementById("about").style.display = "block";
}

function off() {
	document.getElementById("about").style.display = "none";
}
// By Simon Sarris
// www.simonsarris.com
// my name @gmail.com
//
// Last update December 2011
//
// Free to use and distribute at will
// So long as you are nice to people, etc

// Constructor for Shape objects to hold data for all drawn objects.
// For now they will just be defined as rectangles.
//var shapes;
function Shape(x, y, w, h, fill) {
	// This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
	// "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
	// But we aren't checking anything else! We could put "Lalala" for the value of x 
	this.x = x || 0;
	this.y = y || 0;
	this.w = w || 11;
	this.h = h || 11;
	this.fill = fill || '#AAAAAA';
}

// Draws this shape to a given context
Shape.prototype.draw = function (ctx) {
	ctx.fillStyle = this.fill;
	//ctx.fillRect(this.x, this.y, this.w, this.h);
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.w / 2, 0, 2 * Math.PI);
	ctx.fill();
}

function drawParalellogram (ctx) {
	console.log(shapes);
	ctx.globalCompositeOperation = 'destination-over';
	for (i = 0; i < 4; i++) {
		console.log(i);
		ctx.beginPath();
		ctx.moveTo(shapes[i].x, shapes[i].y);
		if (i !== 3) {
			ctx.lineTo(shapes[i + 1].x, shapes[i + 1].y);
		} else {
			ctx.lineTo(shapes[0].x, shapes[0].y);
		}
		ctx.strokeStyle = "#0000FF";
		ctx.stroke();
	}

	// Draw circle and place in middle of the paralellogram
	var middleX = (shapes[0].x + shapes[2].x) / 2;
	var middleY = (shapes[1].y + shapes[3].y) / 2;
	ctx.beginPath();

	// Use first point as zero
	var aX = shapes[1].x - shapes[0].x;
	var aY = shapes[1].y - shapes[0].y;
	var bX = shapes[3].x - shapes[0].x;
	var bY = shapes[3].y - shapes[0].y;
	console.log("ax:" + aX);
	console.log("ay:" + aY);
	console.log("bx:" + bX);
	console.log("by:" + bY);

	// Area of the parallelogram using determinants
	var pArea = Math.abs((aX * bY) - (aY * bX));
	var radius = Math.sqrt((pArea / Math.PI));
	var cArea = radius * radius * Math.PI;
	ctx.arc(middleX, middleY, radius, 0, 2 * Math.PI);
	ctx.strokeStyle = "#FFFF00";
	ctx.stroke();

	// Update info box with information
	info.innerHTML = "Paralelloram area: " + Math.round(pArea) + "px&sup2;<br />Circle area: " + Math.round(cArea) + "px&sup2;<br />" +
		"Point 1: X:" + Math.round(shapes[0].x) + ", Y:" + Math.round(shapes[0].y) + "<br />" +
		"Point 2: X:" + Math.round(shapes[1].x) + ", Y:" + Math.round(shapes[1].y) + "<br />" +
		"Point 3: X:" + Math.round(shapes[2].x) + ", Y:" + Math.round(shapes[2].y) + "<br />" +
		"Point 4: X:" + Math.round(shapes[3].x) + ", Y:" + Math.round(shapes[3].y) + "<br />";

}

// Determine if a point is inside the shape's bounds
Shape.prototype.contains = function (mx, my) {
	// All we have to do is make sure the Mouse X,Y fall in the area between
	// the shape's X and (X + Width) and its Y and (Y + Height)
	return (this.x - this.w / 2 <= mx) && (this.x + this.w / 2 >= mx) &&
		(this.y - this.w / 2 <= my) && (this.y + this.w / 2 >= my);
}

function CanvasState(canvas) {
	// **** First some setup! ****

	this.canvas = canvas;
	this.width = window.innerWidth;
	this.height = window.innerHeight;
	this.ctx = canvas.getContext('2d');
	// This complicates things a little but but fixes mouse co-ordinate problems
	// when there's a border or padding. See getMouse for more detail
	var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
	if (document.defaultView && document.defaultView.getComputedStyle) {
		this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10) || 0;
		this.stylePaddingTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10) || 0;
		this.styleBorderLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10) || 0;
		this.styleBorderTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10) || 0;
	}
	// Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
	// They will mess up mouse coordinates and this fixes that
	var html = document.body.parentNode;
	this.htmlTop = html.offsetTop;
	this.htmlLeft = html.offsetLeft;

	// **** Keep track of state! ****

	this.valid = false; // when set to false, the canvas will redraw everything
	this.shapes = [];  // the collection of things to be drawn
	this.dragging = false; // Keep track of when we are dragging
	// the current selected object. In the future we could turn this into an array for multiple selection
	this.selection = null;
	this.dragoffx = 0; // See mousedown and mousemove events for explanation
	this.dragoffy = 0;

	// **** Then events! ****

	// This is an example of a closure!
	// Right here "this" means the CanvasState. But we are making events on the Canvas itself,
	// and when the events are fired on the canvas the variable "this" is going to mean the canvas!
	// Since we still want to use this particular CanvasState in the events we have to save a reference to it.
	// This is our reference!
	var myState = this;

	//fixes a problem where double clicking causes text to get selected on the canvas
	canvas.addEventListener('selectstart', function (e) { e.preventDefault(); return false; }, false);
	// Up, down, and move are for dragging

	canvas.addEventListener('mousedown', function (e) {
		var mouse = myState.getMouse(e);
		var mx = mouse.x;
		var my = mouse.y;
		shapes = myState.shapes;
		var l = shapes.length;
		console.log("shapes array");
		console.log(shapes);
		
		for (var i = l - 1; i >= 0; i--) {
			if (shapes[i].contains(mx, my)) {
				var mySel = shapes[i];
				// Keep track of where in the object we clicked
				// so we can move it smoothly (see mousemove)
				myState.dragoffx = mx - mySel.x;
				myState.dragoffy = my - mySel.y;
				myState.dragging = true;
				myState.selection = mySel;
				myState.valid = false;
				return;
			}
		}
		// havent returned means we have failed to select anything.
		// If there was an object selected, we deselect it
		if (myState.selection) {
			myState.selection = null;
			myState.valid = false; // Need to clear the old selection border
		}
	}, true);
	canvas.addEventListener('mousemove', function (e) {
		if (myState.dragging) {
			var mouse = myState.getMouse(e);
			// We don't want to drag the object by its top-left corner, we want to drag it
			// from where we clicked. Thats why we saved the offset and use it here
			myState.selection.x = mouse.x - myState.dragoffx;
			myState.selection.y = mouse.y - myState.dragoffy;
			shapes[3].x = shapes[0].x + shapes[2].x - shapes[1].x;
			shapes[3].y = shapes[0].y + shapes[2].y - shapes[1].y;
			myState.valid = false; // Something's dragging so we must redraw
		}
	}, true);
	canvas.addEventListener('mouseup', function (e) {
		myState.dragging = false;
	}, true);
	// double click for making new shapes

	document.getElementById("reset").addEventListener('click', function() {
		myState.ctx.clearRect(0, 0,  c.width, c.height);
		count = 0;
		myState.shapes = [];
		info.innerHTML = "Reseting..";
	}, true);

	canvas.addEventListener('click', function (e) {
		var mouse = myState.getMouse(e);
		count++;
		if (count < 4) {
			console.log("count:" + count);
			//coordinates.push([mouse.x, mouse.y]);
			myState.addShape(new Shape(mouse.x, mouse.y, 11, 11, 'red'));
			if (count == 3) {
				var fourthX = shapes[0].x + shapes[2].x - shapes[1].x;
				var fourthY = shapes[0].y + shapes[2].y - shapes[1].y;
				// draw fourth vertex
				ctx.beginPath();
				var highestX = 0;
				var highestY = 0;
				var lowestX = 9999;
				var lowestY = 9999;
				shapes.forEach(function (shape) {
					if (shape.x > highestX) {
						highestX = shape.x;
					}
					if (shape.y > highestY) {
						highestY = shape.y;
					}
					if (shape.x < lowestX) {
						lowestX = shape.x;
					}
					if (shape.y < lowestY) {
						lowestY = shape.y;
					}
				});
				myState.addShape(new Shape(fourthX, fourthY, 11, 11, '#00FF00'));
			}
		}
	}, true);

	// **** Options! ****

	this.selectionColor = '#CC0000';
	this.selectionWidth = 2;
	this.interval = 30;
	setInterval(function () { myState.draw(); }, myState.interval);
}

CanvasState.prototype.addShape = function (shape) {
	this.shapes.push(shape);
	this.valid = false;
}

CanvasState.prototype.clear = function () {
	this.ctx.clearRect(0, 0, this.width, this.height);
}

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
CanvasState.prototype.draw = function () {
	// if our state is invalid, redraw and validate!
	if (!this.valid) {
		var ctx = this.ctx;
		var shapes = this.shapes;
		this.clear();
		
		// ** Add stuff you want drawn in the background all the time here **

		// draw all shapes
		var l = shapes.length;
		for (var i = 0; i < l; i++) {
			var shape = shapes[i];
			// We can skip the drawing of elements that have moved off the screen:
			if (shape.x > this.width || shape.y > this.height ||
				shape.x - shape.w < 0 || shape.y - shape.h < 0) continue;
			shapes[i].draw(ctx);
		}
		if (l == 4) {
			drawParalellogram(ctx);
		}

		this.valid = true;
	}
}


// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
CanvasState.prototype.getMouse = function (e) {
	var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;

	// Compute the total offset
	if (element.offsetParent !== undefined) {
		do {
			offsetX += element.offsetLeft;
			offsetY += element.offsetTop;
		} while ((element = element.offsetParent));
	}

	// Add padding and border style widths to offset
	// Also add the <html> offsets in case there's a position:fixed bar
	offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
	offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

	mx = e.pageX - offsetX;
	my = e.pageY - offsetY;

	// We return a simple javascript object (a hash) with x and y defined
	return { x: mx, y: my };
}

// If you dont want to use <body onLoad='init()'>
// You could uncomment this init() reference and place the script reference inside the body tag

init();

function init() {
	var s = new CanvasState(document.getElementById('myCanvas'));
	// s.addShape(new Shape(140,140,11,11, 'red')); 
	// s.addShape(new Shape(160,440,11,11, 'red'));
	// s.addShape(new Shape(280,550,11,11, 'red'));
	// s.addShape(new Shape(525,280,11,11, '#00FF00'));
}

  // Now go make something amazing!

