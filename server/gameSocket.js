const http = require ('http');
const {Server} = require('socket.io');
const models = require('./models');
const Account = models.Account;

const {updateRating} = require('./gameLogic/gameLogic.js')

const activeGames = {};
const matchmakingQueue = [];

//conveintly use the io server from various functions in this file without having to pass it in as a parameter to each one
let io;


/// game logic

const MOVES = Object.freeze({
    DRAW : "draw",
    ROCK : "rock",
    SCISSORS: "scissors",
    PAPER: "paper",
});


const getWinner = (p1, p2) =>{
    if (p1 === p2) return "draw";

    if (
        (p1 === MOVES.ROCK && p2 === MOVES.SCISSORS) ||
        (p1 === MOVES.SCISSORS && p2 === MOVES.PAPER) ||
        (p1 === MOVES.PAPER && p2 === MOVES.ROCK)
    ){
        return "p1";
    }
    else{
        return "p2";
    }
};


const movesLogic = async (game, moves, roomId, io) => {
    if (moves.every(m => m !== null)){
        const [p1Id, p2Id] = Object.keys(game.players);

        const p1Move = game.players[p1Id];
        const p2Move = game.players[p2Id];

        const p1User = await Account.findById(p1Id);
        const p2User = await Account.findById(p2Id);


        const result = getWinner(p1Move, p2Move);
        
        let p1Result = 0.5; // draw default
        //let p2Result = 0.5;

        if (result === "p1"){
            p1Result = 1;
            //p2Result = 0;
        }
        else if (result === "p2"){
            p1Result = 0;
            //p2Result = 1;
        }

        
        

        // update ELO (new ratings, etc)
        const { newRatingA, newRatingB} = updateRating(p1User.gameStats.rating, p2User.gameStats.rating, p1Result);

        p1User.gameStats.rating = newRatingA;
        p2User.gameStats.rating = newRatingB;

        // update win and loses
        if (result === "p1"){
            p1User.gameStats.wins++;
            p2User.gameStats.losses++;
        }else if( result === "p2"){
            p1User.gameStats.losses++;
            p2User.gameStats.wins++;
        }


        
        await p1User.save();
        await p2User.save();

        //send to client
        io.to(roomId).emit('game-result', { result, 
            players:{
                [p1Id]: {move: p1Move, username: p1User.username},
                [p2Id]: {move: p2Move, username: p2User.username},
            } });

        delete activeGames[roomId];
    }
}


/// gameplay
const handleMove = (socket, {roomId, move}) =>{
    const game = activeGames[roomId];
    if (!game) return;

    // prevents double moves
    if (game.players[socket.userId] !== null) return;

    game.players[socket.userId] = move;

    const moves = Object.values(game.players);

    movesLogic(game, moves, roomId, io);

    

    
};


/// match making
const handleFindMatch = async (socket) =>{    

    // prevent duplicate entries
    // checks if user already in queue
    const isAlreadyIn = matchmakingQueue.some(s => s.userId === socket.userId);
    if (isAlreadyIn){
        console.log(`User ${socket.userId} tried to join queue again`);
    }


    // check if there is someone waiting to paly
    if (matchmakingQueue.length > 0){
        // FIFO
        const opponent = matchmakingQueue.shift();

        // if opponsent disconnected, find again
        if (!opponent.connected){
            return handleFindMatch(socket);
        }

        // create unique room id
        const roomId = `room_${Date.now()}_${socket.userId}_${opponent.userId}`;

        // put both into the same socket.io room
        socket.join(roomId);
        opponent.join(roomId);

        // initialize active game state
        activeGames[roomId] = {
            players:{
                [socket.userId]: null,
                [opponent.userId]: null,
            }
        };

        // get usernames for both players
        const socketUser = await Account.findById(socket.userId);
        const opponentUser = await Account.findById(opponent.userId);
        
        const socketUsername = socketUser ? socketUser.username : 'You';
        const opponentUsername = opponentUser ? opponentUser.username : 'Opponent';

        // notify socket (player A) of opponent
        socket.emit('match-found', {
            roomId,
            opponentUsername
        });

        // notify opponent (player B) of socket as their opponent
        opponent.emit('match-found', {
            roomId,
            opponentUsername: socketUsername
        });
    }
    else{
        // if queue is empty, add user to it
        matchmakingQueue.push(socket);
    }
};

/// socket setup
// express - socket.io
// https://socket.io/how-to/use-with-express-session 
const gameSocketSetup = (app, sessionMiddle) =>{
    const server = http.createServer(app);
    io = new Server(server);

    io.use((socket, next) =>{
        sessionMiddle(socket.request, {}, next);
    });

    io.use((socket, next) =>{
        const session = socket.request.session;
        if (session && session.account){
            return next();
        }else{
            return next(new Error('unauthorized'));
        }
    });

    io.on('connection', (socket) =>{
        const session = socket.request.session;

        socket.userId = session.account._id;

        socket.emit('init', {userId: socket.userId});

        console.log('user connect', socket.userId);

        socket.on('disconnect', ()=>{
            console.log('a user discounnted', socket.userId);
            const queueIndex = matchmakingQueue.findIndex(s=> s.userId === socket.userId);
            if (queueIndex !== -1){
                matchmakingQueue.splice(queueIndex, 1);
            }
        });

        socket.on('find-match', ()=> handleFindMatch(socket));
        socket.on('make-move', (data)=> handleMove(socket, data));
    });

    return server;
};

module.exports = {
    gameSocketSetup,
}