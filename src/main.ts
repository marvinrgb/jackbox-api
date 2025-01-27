import express, { Application, json as parseRequestJSON, urlencoded as parseURLQuery } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import RouteManager from "./routes/router-manager.js";
import cors from "cors";
import { randomCode, randomCharacter } from "./functions.js";
import { colors, getRandomColor, getDifs } from "./colors.js";
import { getRandomName } from "./names.js";
import { data } from "./openpeeps.js";
// if there a env set use it as port, if not use 3000
const port: number = process.env.API_PORT ? Number(process.env.API_PORT) : 3000;

const app: Application = express();

// remove express header
app.disable("x-powered-by");

// parse requestbody if in json (= make it usable)
app.use(parseRequestJSON());

// the same but for the query parameters
app.use(parseURLQuery());

// app.use((req,res,next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Headers", "*");
//   next();
// })
// app.use(cors({
//   origin: "http://localhost:5173",
// }))

// forwards all requests under /api to the routeManager, wich distributes them further
app.use("/api", RouteManager);


// Socket.IO

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

type lobby = {
  code: string,
  displaySocket: Socket,
  maxPlayers: number
  players: Array<{
    socket: Socket,
    name: string,
    score: number
    properties: {
      head: number,
      body: number,
      face: number,
      accessories: number
    }
  }>
}

const lobbies: Array<lobby> = []; // json file storage?
const CPs: Array<{code:string,roundAmount:number,rounds:Array<{colorname:string,color:{h:number,s:number,l:number},time:number,picks:Array<{id:string,color:{h:number,s:number,l:number}}>}>}> = [];

function getUserDisplayData(lobbyIndex: number): Array<any> {
  const lobby = lobbies[lobbyIndex];
  const players: Array<any> = [];
  lobby.players.forEach((p) => {
    players.push({
      name: p.name,
      properties: p.properties,
      score: p.score
    })
  })
  return players;
}

interface customSocket extends Socket {
  lobbyIndex?: number,
  playerIndex?: number
}

io.on("connection", (socket: customSocket) => {
  // console.log("A user connected");

  socket.on("create-lobby", () => {
    const lobbyIndex = lobbies.findIndex((lobby) => (lobby.displaySocket.id == socket.id));
    if (lobbyIndex != -1) {
      socket.emit("error", {
        text: "You already created a game!"
      });
      return;
    }
    const code = randomCode();
    console.log(`Creating new Lobby with code: ${code}`);
    lobbies.push({
      code: code,
      displaySocket: socket,
      players: [],
      maxPlayers: 4
    })
    socket.emit("lobby-creation-confirm", code);
  });
  socket.on("join-lobby", (code: string) => {
    console.log(`User ${socket.id} attempting to join Lobby: ${code}`);
    const lobbyIndex: number = lobbies.findIndex((game) => game.code == code);
    if (lobbyIndex == -1) {
      return socket.emit("error", {text:"Lobby does not exist"})
    }
    if (lobbies[lobbyIndex].players.length == lobbies[lobbyIndex].maxPlayers) {
      return socket.emit("error", {text:"Lobby is already full"})
    }
    const defaultName: string = getRandomName();
    const defaultProperties = randomCharacter();
    lobbies[lobbyIndex].players.push({
      name: defaultName, 
      score: 0, 
      socket: socket, 
      properties: defaultProperties});
    lobbies[lobbyIndex].displaySocket.emit('players', getUserDisplayData(lobbyIndex));
    socket.lobbyIndex = lobbyIndex;
    socket.playerIndex = lobbies[lobbyIndex].players.length-1;
    socket.emit("api/join-lobby-confirm", {
      name: defaultName,
      propertyMax: {
        head: data.head.length,
        face: data.face.length,
        accessories: data.accessories.length,
        body: data.body.length
      },
      properties: defaultProperties
    })
  });
  socket.on("character-change", (data: {property:"head"|"body"|"face"|"accessories",value:number}) => {
    console.log(`Character change incoming ${data.property} - ${data.value}`);
    const lobbyIndex = lobbies.findIndex((game) => game.players.find((player) => player.socket.id == socket.id));
    const playerIndex = lobbies[lobbyIndex].players.findIndex((player) => player.socket.id == socket.id);
    lobbies[lobbyIndex].players[playerIndex].properties[data.property] += data.value;
    lobbies[lobbyIndex].displaySocket.emit('players', getUserDisplayData(lobbyIndex));
    socket.emit("api/character-change-confirm", lobbies[lobbyIndex].players[playerIndex].properties);
    // lobbies[lobbyIndex].players.forEach((player) => {
    //   player.socket.emit('players', lobbies[lobbyIndex].players.map((player) => {player.properties}));
    // })
    // io.emit('players', lobbies[lobbyIndex].players.map((player) => player.properties));
  })
  socket.on("user/name-change", (name) => {
    const lobbyIndex = lobbies.findIndex((game) => game.players.find((player) => player.socket.id == socket.id));
    const playerIndex = lobbies[lobbyIndex].players.findIndex((player) => player.socket.id == socket.id);
    lobbies[lobbyIndex].players[playerIndex].name = name;
    lobbies[lobbyIndex].displaySocket.emit('players', getUserDisplayData(lobbyIndex));
  })
  socket.on("display/get-player-data", () => {
    const lobbyIndex = lobbies.findIndex((lobby) => (lobby.displaySocket.id == socket.id));
    socket.emit('players', getUserDisplayData(lobbyIndex));
  })

  socket.on("display/gamestart", (game) => {
    console.log(lobbies)
    const lobbyIndex = lobbies.findIndex((lobby) => (lobby.displaySocket.id == socket.id));
    console.log(lobbyIndex)
    console.log(`Game start incoming: ${game} in lobby: ${lobbies[lobbyIndex].code}`);
    switch (game) {
      case 'colorpicker':
        CPs.push({
          code: lobbies[lobbyIndex].code,
          rounds: [],
          roundAmount: 5
        });
        break;
    
      default:
        break;
    }
    lobbies[lobbyIndex].displaySocket.emit('gamestart', game);
    lobbies[lobbyIndex].players.forEach((player) => {
      player.socket.emit('gamestart', game);
    });    
  })
  socket.on("display/game/cp/roundstart", (data) => {
    console.log(`Color Picker roundstart with pickTime: ${data.pickTime} and rounds: ${data.rounds}`);
    const lobbyIndex = lobbies.findIndex((lobby) => (lobby.displaySocket.id == socket.id));
    const randomColor = getRandomColor();
    const roundDetails = {
      colorname: randomColor.name,
      color: randomColor.hsl,
      time: data.pickTime,
      picks: []
    }
    const cpIndex = CPs.findIndex((cp) => cp.code == lobbies[lobbyIndex].code);
    CPs[cpIndex].roundAmount = data.rounds;
    CPs[cpIndex].rounds.push(roundDetails)
    lobbies[lobbyIndex].displaySocket.emit("api/game/cp/roundstart", roundDetails)
    lobbies[lobbyIndex].players.forEach((player) => {
      player.socket.emit('api/game/cp/roundstart');
    });

  })
  socket.on("player/game/cp/pick", (color) => {
    const lobbyIndex = lobbies.findIndex((game) => game.players.find((player) => player.socket.id == socket.id));
    console.log(`Color pick incoming: ${color} in lobby: ${lobbies[lobbyIndex].code}`);
    const cpIndex = CPs.findIndex((cp) => cp.code == lobbies[lobbyIndex].code);
    CPs[cpIndex].rounds[CPs[cpIndex].rounds.length-1].picks.push({
      id: socket.id,
      color: color
    });
    if (CPs[cpIndex].rounds[CPs[cpIndex].rounds.length-1].picks.length == lobbies[lobbyIndex].players.length) {
      const results: Array<{percentage:number,name?:string,properties?:any,score?:number,winner?:boolean}> = getDifs( CPs[cpIndex].rounds[CPs[cpIndex].rounds.length-1].color, CPs[cpIndex].rounds[CPs[cpIndex].rounds.length-1].picks.map((p) => p.color))
      const players = lobbies[lobbyIndex].players;
      for (let i = 0; i < results.length; i++) {
        if (Math.max(...(results.map((r) => r.percentage))) == results[i].percentage) {
          lobbies[lobbyIndex].players[i].score += 1;
          results[i].score = lobbies[lobbyIndex].players[i].score
          results[i].winner = true;
        } else {
          results[i].winner = false;
        }
        results[i].name = players[i].name
        results[i].properties = players[i].properties
        // players[i].socket.emit("api/waitingroom");
      }
      console.log("CP Round Result:");
      console.log(results);
      lobbies[lobbyIndex].displaySocket.emit("api/game/cp/roundresult", results);
      if (CPs[cpIndex].roundAmount == CPs[cpIndex].rounds.length) {
        console.log("End of Color Picker game. Emitting api/gameresult and api/redirect/lobby");
        lobbies[lobbyIndex].displaySocket.emit("api/gameresult", getUserDisplayData(lobbyIndex));
        lobbies[lobbyIndex].players.forEach((player) => {
          player.socket.emit("api/redirect/lobby");
        })
      }
    }
  })


  socket.on("disconnect", () => {
    // console.log("A user disconnected");
  });
});














// starts the server under the specified port
server.listen(port, () => {
  console.log(`api running on port ${port}`);
});