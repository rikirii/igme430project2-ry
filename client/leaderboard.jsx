const React = require('react');
const {useState, useEffect} = React;


const Leaderboard = () =>{
    const [players, setPlayers] = useState([]);

    useEffect( ()=>{
        const fetchLeaderboard = async ()=>{
            const res = await fetch('/getLeaderboard');
            const data = await res.json();
            setPlayers(data.players);
        };
        fetchLeaderboard();
    },[]);

    return (
        <div className="leaderboard-container">
            <h1>Top 10 Players</h1>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Rating</th>
                        <th>W/L</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map((player,index) =>(
                        <tr key={player._id}>
                            <td>{index+1}</td>
                            <td>{player.username}</td>
                            <td>{player.gameStats.rating}</td>
                            <td>{player.gameStats.wins} / {player.gameStats.losses}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;