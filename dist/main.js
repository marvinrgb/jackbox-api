"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const router_manager_js_1 = __importDefault(require("./routes/router-manager.js"));
const functions_js_1 = require("./functions.js");
const colors_js_1 = require("./colors.js");
const names_js_1 = require("./names.js");
const openpeeps_js_1 = require("./openpeeps.js");
// if there a env set use it as port, if not use 3000
const port = process.env.API_PORT ? Number(process.env.API_PORT) : 3000;
const app = (0, express_1.default)();
// remove express header
app.disable("x-powered-by");
// parse requestbody if in json (= make it usable)
app.use((0, express_1.json)());
// the same but for the query parameters
app.use((0, express_1.urlencoded)());
// app.use((req,res,next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Headers", "*");
//   next();
// })
// app.use(cors({
//   origin: "http://localhost:5173",
// }))
// forwards all requests under /api to the routeManager, wich distributes them further
app.use("/api", router_manager_js_1.default);
// Socket.IO
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*"
    }
});
const lobbies = []; // json file storage?
const CPs = [];
function getUserDisplayData(lobbyIndex) {
    const lobby = lobbies[lobbyIndex];
    const players = [];
    lobby.players.forEach((p) => {
        players.push({
            name: p.name,
            properties: p.properties,
            score: p.score
        });
    });
    return players;
}
io.on("connection", (socket) => {
    // console.log("A user connected");
    socket.on("create-lobby", () => {
        const lobbyIndex = lobbies.findIndex((lobby) => (lobby.displaySocket.id == socket.id));
        if (lobbyIndex != -1) {
            socket.emit("error", {
                text: "You already created a game!"
            });
            return;
        }
        const code = (0, functions_js_1.randomCode)();
        console.log(`Creating new Lobby with code: ${code}`);
        lobbies.push({
            code: code,
            displaySocket: socket,
            players: [],
            maxPlayers: 4
        });
        socket.emit("lobby-creation-confirm", code);
    });
    socket.on("join-lobby", (code) => {
        console.log(`User ${socket.id} attempting to join Lobby: ${code}`);
        const lobbyIndex = lobbies.findIndex((game) => game.code == code);
        if (lobbyIndex == -1) {
            return socket.emit("error", { text: "Lobby does not exist" });
        }
        if (lobbies[lobbyIndex].players.length == lobbies[lobbyIndex].maxPlayers) {
            return socket.emit("error", { text: "Lobby is already full" });
        }
        const defaultName = (0, names_js_1.getRandomName)();
        const defaultProperties = (0, functions_js_1.randomCharacter)();
        lobbies[lobbyIndex].players.push({
            name: defaultName,
            score: 0,
            socket: socket,
            properties: defaultProperties
        });
        lobbies[lobbyIndex].displaySocket.emit('players', getUserDisplayData(lobbyIndex));
        socket.lobbyIndex = lobbyIndex;
        socket.playerIndex = lobbies[lobbyIndex].players.length - 1;
        socket.emit("api/join-lobby-confirm", {
            name: defaultName,
            propertyMax: {
                head: openpeeps_js_1.data.head.length,
                face: openpeeps_js_1.data.face.length,
                accessories: openpeeps_js_1.data.accessories.length,
                body: openpeeps_js_1.data.body.length
            },
            properties: defaultProperties
        });
    });
    socket.on("character-change", (data) => {
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
    });
    socket.on("user/name-change", (name) => {
        const lobbyIndex = lobbies.findIndex((game) => game.players.find((player) => player.socket.id == socket.id));
        const playerIndex = lobbies[lobbyIndex].players.findIndex((player) => player.socket.id == socket.id);
        lobbies[lobbyIndex].players[playerIndex].name = name;
        lobbies[lobbyIndex].displaySocket.emit('players', getUserDisplayData(lobbyIndex));
    });
    socket.on("display/get-player-data", () => {
        const lobbyIndex = lobbies.findIndex((lobby) => (lobby.displaySocket.id == socket.id));
        socket.emit('players', getUserDisplayData(lobbyIndex));
    });
    socket.on("display/gamestart", (game) => {
        console.log(lobbies);
        const lobbyIndex = lobbies.findIndex((lobby) => (lobby.displaySocket.id == socket.id));
        console.log(lobbyIndex);
        console.log(`Game start incoming: ${game} in lobby: ${lobbies[lobbyIndex].code}`);
        switch (game) {
            case 'colorpicker':
                CPs.push({
                    code: lobbies[lobbyIndex].code,
                    rounds: []
                });
                break;
            default:
                break;
        }
        lobbies[lobbyIndex].displaySocket.emit('gamestart', game);
        lobbies[lobbyIndex].players.forEach((player) => {
            player.socket.emit('gamestart', game);
        });
    });
    socket.on("display/game/cp/roundstart", (data) => {
        console.log(`Color Picker roundstart with pickTime: ${data.pickTime} and rounds: ${data.rounds}`);
        const lobbyIndex = lobbies.findIndex((lobby) => (lobby.displaySocket.id == socket.id));
        const randomColor = (0, colors_js_1.getRandomColor)();
        const roundDetails = {
            colorname: randomColor.name,
            color: randomColor.hsl,
            time: data.pickTime,
            picks: []
        };
        const cpIndex = CPs.findIndex((cp) => cp.code == lobbies[lobbyIndex].code);
        CPs[cpIndex].roundAmount = data.rounds;
        CPs[cpIndex].rounds.push(roundDetails);
        lobbies[lobbyIndex].displaySocket.emit("api/game/cp/roundstart", roundDetails);
        lobbies[lobbyIndex].players.forEach((player) => {
            player.socket.emit('api/game/cp/roundstart');
        });
    });
    socket.on("player/game/cp/pick", (color) => {
        const lobbyIndex = lobbies.findIndex((game) => game.players.find((player) => player.socket.id == socket.id));
        console.log(`Color pick incoming: ${color} in lobby: ${lobbies[lobbyIndex].code}`);
        const cpIndex = CPs.findIndex((cp) => cp.code == lobbies[lobbyIndex].code);
        CPs[cpIndex].rounds[CPs[cpIndex].rounds.length - 1].picks.push({
            id: socket.id,
            color: color
        });
        if (CPs[cpIndex].rounds[CPs[cpIndex].rounds.length - 1].picks.length == lobbies[lobbyIndex].players.length) {
            const results = (0, colors_js_1.getDifs)(CPs[cpIndex].rounds[CPs[cpIndex].rounds.length - 1].color, CPs[cpIndex].rounds[CPs[cpIndex].rounds.length - 1].picks.map((p) => p.color));
            const players = lobbies[lobbyIndex].players;
            for (let i = 0; i < results.length; i++) {
                if (Math.max((results.map((r) => r.percentage))) == results[i].percentage) {
                    lobbies[lobbyIndex].players[i].score += 1;
                    results[i].score = lobbies[lobbyIndex].players[i].score;
                    results[i].winner = true;
                }
                else {
                    results[i].winner = false;
                }
                results[i].name = players[i].name;
                results[i].properties = players[i].properties;
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
                });
            }
        }
    });
    socket.on("disconnect", () => {
        // console.log("A user disconnected");
    });
});
// starts the server under the specified port
server.listen(port, () => {
    console.log(`api running on port ${port}`);
});
//# sourceMappingURL=main.js.map