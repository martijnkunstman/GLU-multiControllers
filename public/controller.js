/*
var options = {
    zone: Element,                  // active zone
    color: String,
    size: Integer,
    threshold: Float,               // before triggering a directional event
    fadeTime: Integer,              // transition time
    multitouch: Boolean,
    maxNumberOfNipples: Number,     // when multitouch, what is too many?
    dataOnly: Boolean,              // no dom element whatsoever
    position: Object,               // preset position for 'static' mode
    mode: String,                   // 'dynamic', 'static' or 'semi'
    restJoystick: Boolean,
    restOpacity: Number,            // opacity when not 'dynamic' and rested
    lockX: Boolean,                 // only move on the X axis
    lockY: Boolean,                 // only move on the Y axis
    catchDistance: Number,          // distance to recycle previous joystick in
                                    // 'semi' mode
    shape: String,                  // 'circle' or 'square'
    dynamicPage: Boolean,           // Enable if the page has dynamically visible elements
    follow: Boolean,                // Makes the joystick follow the thumbstick
};
*/

let joystick = nipplejs.create({
    zone: document.getElementById('static'),
    mode: 'static',
    position: { left: '50%', top: '50%' },
    color: 'black'
});

joystick.on("move", function (evt, data) {
    document.getElementById("output").innerHTML = parseFloat(data.vector.x.toFixed(2)) + " " + parseFloat(data.vector.y.toFixed(2));
    direction = { x: data.vector.x, y: data.vector.y };
    socket.emit('joystick', direction);
});

joystick.on("end", function () {
    document.getElementById("output").innerHTML = 0 + " " + 0;
    direction = { x: 0, y: 0 };
    socket.emit('joystick', direction);
});

let socket = io.connect();
socket.on("connect", function () {
    socket.emit("initController");
});