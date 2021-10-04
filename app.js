const express = require('express')
const app = express()
const port = process.env.PORT || 8080;
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.use(express.static('public'))

const socket = require('socket.io')
const io = socket(server)

let gameData = [];
let speed = 50;

io.on('connection', newConnection)

function newConnection(socket) {
   socket.on('disconnect', function () {
      listToDelete = [socket.id]
      gameData = gameData.filter(el => (-1 == listToDelete.indexOf(el.id)))
   });

   socket.on('initController', function () {
      let number = getNumber();
      gameData.push({ "number": number, "id": socket.id, "joystick": { x: 0, y: 0 }, "position": { x: 0, y: 0 }, "velocity": { x: 0, y: 0 } });
   });

   socket.on('joystick', function (joystick) {
      gameData.find(x => x.id === socket.id).joystick = joystick;
   });
}

function getNumber() {
   let array = [];
   for (let a = 0; a < gameData.length; a++) {
      array.push(gameData[a].number);
   }
   array.sort(function (a, b) { return a - b });
   if (array.length === 0) {
      return 1;
   }
   else {
      return array[array.length-1]+1;
   }   
}

function tick() {
   //calculate new position
   for (let i = 0; i < gameData.length; i++) {
      //damping
      gameData[i].velocity.x = gameData[i].velocity.x - gameData[i].velocity.x / 16;
      gameData[i].velocity.y = gameData[i].velocity.y - gameData[i].velocity.y / 16;

      //velocity
      gameData[i].velocity.x = gameData[i].velocity.x + gameData[i].joystick.x;
      gameData[i].velocity.y = gameData[i].velocity.y - gameData[i].joystick.y;

      if (gameData[i].velocity.x > 10) {
         gameData[i].velocity.x = 10;
      }
      if (gameData[i].velocity.x < -10) {
         gameData[i].velocity.x = -10;
      }
      if (gameData[i].velocity.y > 10) {
         gameData[i].velocity.y = 10;
      }
      if (gameData[i].velocity.y < -10) {
         gameData[i].velocity.y = -10;
      }

      gameData[i].position.x = gameData[i].position.x + gameData[i].velocity.x;
      gameData[i].position.y = gameData[i].position.y + gameData[i].velocity.y;

      if (gameData[i].position.x < 0) {
         gameData[i].position.x = 400;
      }
      if (gameData[i].position.x > 400) {
         gameData[i].position.x = 0;
      }
      if (gameData[i].position.y < 0) {
         gameData[i].position.y = 400;
      }
      if (gameData[i].position.y > 400) {
         gameData[i].position.y = 0;
      }
   }
   io.emit('gameData', gameData);
   setTimeout(tick, speed);
}
tick();