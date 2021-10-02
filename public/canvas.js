let socket;
let gameData;
let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
//--------------------------------------
socket = io.connect();
//--------------------------------------
socket.on("gameData", render);

function render(data) {
  let players = "";
  ctx.clearRect(0, 0, 400, 400);
  for (let i = 0; i < data.length; i++) {
    players = players + data[i].position.x + " " + data[i].position.y + "<br>";
    ctx.beginPath();
    ctx.arc(data[i].position.x, data[i].position.y, 10, 0, 2 * Math.PI);
    ctx.stroke();
  }
  

}