
var c = document.getElementById("myCanvas");
var info = document.getElementById("info");
info.innerHTML = "Place 3 pointers to see information here.";
c.width = window.innerWidth;
c.height = window.innerHeight;
var ctx = c.getContext("2d");
var count = 0;
var coordinates = [];
var myState = this;

//c.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);

// ctx.beginPath();
// ctx.moveTo(500, 500);            
// ctx.lineTo(600, 500);
// ctx.lineTo(600, 600);
// ctx.lineTo(500, 600);
// ctx.lineTo(500, 500);
// ctx.stroke();

function reset() {
    ctx.clearRect(0, 0,  c.width, c.height);
    count = 0;
    coordinates = [];
    info.innerHTML = "Reseting..";
}

function on() {
    document.getElementById("about").style.display = "block";
}

function off() {
    document.getElementById("about").style.display = "none";
}

// Sorting by X-coordinate
function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}

c.addEventListener('click', function(event) {
    count++;
    if (count < 4) {
        console.log("count:" + count);
        coordinates.push([event.clientX, event.clientY]);
        // var element = document.createElement("div");
        // element.classList.add("point");
        // element.style.top = event.clientY - 5 + "px";
        // element.style.left = event.clientX - 5 + "px";
        // document.getElementById('main').appendChild(element);
        ctx.beginPath();
        //ctx.moveTo(event.clientX, event.clientY);
        ctx.arc(event.clientX, event.clientY, 5.5, 0, 2 * Math.PI);
        ctx.fillStyle = "#FF0000";
        ctx.fill();
        //ctx.stroke();
        if (count == 3) {
            var fourthX = coordinates[0][0] + coordinates[2][0] - coordinates[1][0];
            var fourthY = coordinates[0][1] + coordinates[2][1] - coordinates[1][1];
            // draw fourth vertex
            ctx.beginPath();
            coordinates.push([fourthX, fourthY]);
            var highestX = 0;
            var highestY = 0;
            var lowestX = 9999;
            var lowestY = 9999;
            coordinates.forEach(function(coordinate) {
                if (coordinate[0] > highestX) {
                    highestX = coordinate[0];
                }
                if (coordinate[1] > highestY) {
                    highestY = coordinate[1];
                }
                if (coordinate[0] < lowestX) {
                    lowestX = coordinate[0];
                }
                if (coordinate[1] < lowestY) {
                    lowestY = coordinate[1];
                }
            });
            var middleCoords = [];
            coordinates.forEach(function(coordinate) {
                if (coordinate[0] < highestX && coordinate[0] > lowestX) {
                    middleCoords.push(coordinate);
                }
            });
            console.log("highestX: " + highestX);
            console.log("highestY: " + highestY);
            console.log("lowestX: " + lowestX);
            console.log("lowestY: " + lowestY);
            console.log(middleCoords);
            // if (middleCoords[0][0] > middleCoords[1][0]) {
            //     var b = middleCoords[0];
            //     middleCoords[0] = middleCoords[1];
            //     middleCoords[1] = b;
            // }
            console.log(middleCoords);
            // var pArea = Math.pow(middleCoords[0][0] - middleCoords[1][0], 2) + Math.pow(middleCoords[0][1] - middleCoords[1][1], 2);
            // pArea = Math.sqrt(pArea);
            // console.log(pArea);
            //ctx.moveTo(fourthX, fourthY);
            ctx.strokeStyle = "#00FF00";
            ctx.arc(fourthX, fourthY, 5.5, 0, 2 * Math.PI);
            ctx.fillStyle = "#00FF00";
            ctx.fill();
            ctx.stroke();
            // draw 
            var i;
            console.log(coordinates);
            ctx.globalCompositeOperation='destination-over';
            for (i = 0; i < 4; i++) {
                console.log(i);
                ctx.moveTo(coordinates[i][0], coordinates[i][1]);
                if (i !== 3) {
                    ctx.lineTo(coordinates[i+1][0], coordinates[i+1][1]);
                } else {
                    ctx.lineTo(coordinates[0][0], coordinates[0][1]);
                }
                ctx.strokeStyle = "#0000FF";
                ctx.stroke();
            }
            var middleX = (coordinates[0][0] + coordinates[2][0]) / 2;
            var middleY = (coordinates[1][1] + coordinates[3][1]) / 2;
            ctx.beginPath();

            // Save the original coordinates for points to remember in what order they have been placed.
            var originalCoordinates = coordinates;
            coordinates.sort(sortFunction);
            console.log(coordinates);

            // Use first point as zero
            var aX = coordinates[1][0] - coordinates[0][0];
            var aY = coordinates[1][1] - coordinates[0][1];
            var bX = coordinates[3][0] - coordinates[0][0];
            var bY = coordinates[3][1] - coordinates[0][1];
            console.log("ax:" + aX);
            console.log("ay:" + aY);
            console.log("bx:" + bX);
            console.log("by:" + bY);

            // Area of the parallelogram using determinants
            var pArea = Math.abs((aX * bY) - (aY * bX));

            console.log("pArea: " + pArea);
            var radius = Math.sqrt((pArea /  Math.PI));
            console.log("radius: " + radius);
            var cArea = radius * radius * Math.PI;
            console.log("circle area: " + cArea);
            ctx.arc(middleX, middleY, radius, 0, 2 * Math.PI);
            ctx.strokeStyle = "#FFFF00";
            ctx.stroke();

            info.innerHTML = "Paralelloram area: " + pArea + "px&sup2;<br />Circle area: " + cArea + "px&sup2;<br />" + 
            "Coords point 1: " + originalCoordinates[0][0] + ", " + originalCoordinates[0][1] + "<br />" +
            "Coords point 2: " + originalCoordinates[1][0] + ", " + originalCoordinates[1][1] + "<br />" + 
            "Coords point 3: " + originalCoordinates[2][0] + ", " + originalCoordinates[2][1] + "<br />" + 
            "Coords point 4: " + originalCoordinates[3][0] + ", " + originalCoordinates[3][1] + "<br />";
        }
    }    
}, false);

