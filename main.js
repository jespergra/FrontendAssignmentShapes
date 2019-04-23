var count = 0;
var coordinates = [];
document.addEventListener('click', function(event) {
    
    
    count++;
    if (count < 4) {
        console.log("count:" + count);
        coordinates.push([event.clientX, event.clientY]);
        var element = document.createElement("div");
        element.classList.add("point");
        element.style.top = event.clientY - 5 + "px";
        element.style.left = event.clientX - 5 + "px";
        document.getElementById('main').appendChild(element);
        //document.body.appendChild(element);
        event = event || window.event;
        //var target = event.target || event.srcElement;  
        if (count == 3) {
            var diffX = coordinates[0][0] - coordinates[1][0];
            var diffY = coordinates[2][1] - coordinates[0][1];
            coordinates.push([event.clientX, event.clientY]);
            var element4 = document.createElement("div");
            element4.classList.add("point");
            element4.style.top = coordinates[1][1] + diffY + "px";
            element4.style.left = coordinates[2][0] - diffX + "px";
            document.getElementById('main').appendChild(element4);
            event = event || window.event;
        }
        console.log("X and Y");
        console.log(coordinates);
    }
    
    
}, false);

// var m = document.getElementById('point');
// m.addEventListener('mousedown', mouseDown, false);
// window.addEventListener('mouseup', mouseUp, false);


function mouseUp() {
    window.removeEventListener('mousemove', move, true);
}

function mouseDown(e) {
    window.addEventListener('mousemove', move, true);
}

function move(e) {
    m.style.top = e.clientY + 'px';
    m.style.left = e.clientX + 'px';
};