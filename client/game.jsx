import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { object } from 'underscore';

// const socket = io({
//     withCredentials: true //for redis
// });

const Game = () => {
    const [screen, setScreen] = useState('menu');
    const [roomId, setRoomId] = useState(null);
    const [result, setResult] = useState(null);
    const [status, setStatus] = useState('');
    const [opponentName, setOpponentName] = useState('');

    const [myUserId, setMyUserId] = useState(null);

    // socket setup

    // use a ref to store socket instance
    // https://react.dev/reference/react/useRef 
    const socketRef = useRef(null);

    const matchMaking = () => {

        // only connect if no socket yet
        if (!socketRef.current) {
            socketRef.current = io({ withCredentials: true });

            // set up listeners only once

            socketRef.current.on('init', ({ userId }) => {
                setMyUserId(userId);
            })

            socketRef.current.on('match-found', ({ roomId, opponentUsername }) => {
                setRoomId(roomId);
                setOpponentName(opponentUsername);
                setScreen('game');
                setStatus('Choose your move');
            });

            socketRef.current.on('game-result', (data) => {
                setResult(data);
                setScreen('result');
            });

        }

        setScreen('queue');
        setStatus('Finding match...');
        socketRef.current.emit('find-match');
    }

    useEffect(() => {
        return () => {
            // clean up socket connection and listeners on unmount
            if (socketRef.current){
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            
        };
    }, []);

    // action

    const sendMove = (move) => {
        setStatus('Waiting for opponent...');
        socketRef.current.emit('make-move', { roomId, move });
    };


    // screens

    if (screen === 'menu') {
        return (
            <div className='lobby'>
                <h1>Rock Paper Scissors</h1>
                <button onClick={matchMaking}>Play Ranked</button>
            </div>
        );
    }

    if (screen === 'queue') {
        return <h2 className='queue'>{status}</h2>;
    }

    if (screen === 'game') {
        return (
            <div className='gameScreen'>
                <h2>You vs {opponentName}</h2>
                <h2>{status}</h2>

                <button onClick={() => sendMove('rock')}>Rock</button>
                <button onClick={() => sendMove('paper')}>Paper</button>
                <button onClick={() => sendMove('scissors')}>Scissors</button>
            </div>
        );
    }

    if (screen === 'result' && result) {
        const { result: winner, players } = result; //destructure from server
        const playerIds = Object.keys(players);

        let statusMessage = "";
        if (winner === "draw") {
            statusMessage = "It's a Draw!";
        }
        else {
            const p1Id = playerIds[0];
            const p2Id = playerIds[1]

            const winningId = (winner === "p1") ? p1Id : p2Id;

            if (winningId === myUserId) {
                statusMessage = "You Won!";
            }
            else {
                statusMessage = "You Lose...";
            }
        }

        return (
            <div className="result-container">
                <h2>Result: {statusMessage}</h2>
                <div className='statBreakdown'>
                    {playerIds.map(id => (
                        <div key={id} className="player-move">
                            <p>
                                <strong>{id === myUserId ? "You: " : `${players[id].username}: `}</strong>
                                <span>{players[id].move}</span>
                            </p>

                        </div>
                    ))}
                </div>

                <button onClick={matchMaking}>Play Again</button>
            </div>
        );
    }

    return null;

}

export default Game;


