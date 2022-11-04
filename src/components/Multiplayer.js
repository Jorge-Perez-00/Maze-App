//import db from './firebase'
//import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
//import { set } from 'firebase/database';

//import { onChildAdded, onChildRemoved, onValue } from 'firebase/database';

import Sidebar from './Sidebar'

import { useEffect } from 'react';
import { useState } from 'react';
import { db, auth, _signInAnonymously, _onAuthStateChanged, _ref, _set, _onDisconnect, _onChildAdded, _onChildRemoved, _onValue } from './firebase'

import Maze from './Maze'
import { set } from 'firebase/database';

let playerID;
let myPlayerNumber;
let playerRef;
let players = {};


let host;



function Multiplayer(props) {

    let [online, setOnline] = useState(false);

    let [name, setName] = useState("")
    let [hasUsername, setUsername] = useState(false);

    //firebase.auth().signInAnonymously();

    //const auth = getAuth();

    let [player, setPlayer] = useState("OPEN");
    let [player2, setPlayer2] = useState("OPEN");
    let [player3, setPlayer3] = useState("OPEN");
    let [player4, setPlayer4] = useState("OPEN");

    let [host, setHost] = useState(false);
    let [start, setStart] = useState(true);
    let [newMaze, setNewMaze] = useState(true);



    //let playerID;
    //let playerRef;
   
    useEffect(() => {
        
        signIn();
       

    },[])

    function handleOnKeyDown(event) {
        console.log(event.key)
        console.log(players[playerID].x);


        //if (this.state.start) {
            //const maze = this.state.maze;
            //let PlayerPosition = { ...player }
            
            let positionX = players[playerID].x;
            let positionY = players[playerID].y;

            if (event.key === "ArrowUp") {
                positionX--;
            }
            else if (event.key === "ArrowDown") {
                positionX++;
            }
            else if (event.key === "ArrowLeft") {
                positionY--;
            }
            else if (event.key === "ArrowRight") {
                positionY++;

            }

            if((positionX !== -1 && positionX !== 30) && (positionY !== -1 && positionY !== 30) ) {
                players[playerID].x = positionX;
                players[playerID].y = positionY;

                _set(playerRef, players[playerID]);
            }
            

            //let row = PlayerPosition.x;
            //let col = PlayerPosition.y;
        //if ((row !== -1 && row !== 30) && (col !== -1 && col !== 30)) {

        //}
            /*
            if ((row !== -1 && row !== this.state.rows) && (col !== -1 && col !== this.state.columns) && maze[row][col] !== -9999) {
                this.setState({
                    player: PlayerPosition,
                    gameMessage: (row === this.state.rows - 1 && col === this.state.columns - 1) ? "You Won!" : "",
                    start: (row === this.state.rows - 1 && col === this.state.columns - 1) ? false : true,
                    newMaze: (row === this.state.rows - 1 && col === this.state.columns - 1) ? true : false,
                })

            }
            */
            //console.log(event.key);

        //}

    }

    function Game() {
        const allPlayersRef = _ref(db, 'players');
        const hostRef = _ref(db, 'host');

        _onValue(hostRef, (snapshot) => {
            //console.log("HOST: ", snapshot.val());
            const hostData = snapshot.val();
            
            host = hostData !== null ? hostData.player : null;

            console.log("HOST NUMBER: ", host);
            /*
            if(host !== null) {
                console.log(host.player)
                
            }
            */
        })

        _onValue(allPlayersRef, (snapshot) => {
            console.log("                   ");
            console.log("SNAPSHOT: ", snapshot.val());
            //console.log("SNAPSHOT NUMBER: ", snapshot.val().length());
            players = snapshot.val();
            if(players !== null) {
                console.log("THERE ARE PLAYERS IN GAME!");
            }

            snapshot.forEach((player) => {
                const playerKey = player.key; 
                const playerData = player.val();
                //console.log(playerID);
                
                console.log(playerData);
                
                if(playerKey === playerID) {
                    if(playerData.host === true) {
                        setHost(true);
                    }

                    if (playerData.playerNumber === 1) {
                        setPlayer({ x: playerData.x, y: playerData.y, player: "you" });
                    }
                    else if (playerData.playerNumber === 2) {
                        setPlayer2({ x: playerData.x, y: playerData.y, player: "you" });
                    }
                    else if (playerData.playerNumber === 3) {
                        setPlayer3({ x: playerData.x, y: playerData.y, player: "you" });
                    }
                    else if (playerData.playerNumber === 4) {
                        setPlayer4({ x: playerData.x, y: playerData.y, player: "you" });
                    }
                }
                else{
                    if (playerData.playerNumber === 1) {
                        setPlayer({ x: playerData.x, y: playerData.y, player: "other" });
                    }
                    else if (playerData.playerNumber === 2) {
                        setPlayer2({ x: playerData.x, y: playerData.y, player: "other" });
                    }
                    else if (playerData.playerNumber === 3) {
                        setPlayer3({ x: playerData.x, y: playerData.y, player: "other" });
                    }
                    else if (playerData.playerNumber === 4) {
                        setPlayer4({ x: playerData.x, y: playerData.y, player: "other" });
                    }
                }
                /*
                if (playerData.playerNumber === 1) {
                    setPlayer({ x: playerData.x, y: playerData.y });
                }
                else if (playerData.playerNumber === 2) {
                    setPlayer2({ x: playerData.x, y: playerData.y });
                }
                else if (playerData.playerNumber === 3) {
                    setPlayer3({ x: playerData.x, y: playerData.y });
                }
                */
        
            });
        })

        _onChildAdded(allPlayersRef, (snapshot)=>{
            const newPlayer = snapshot.val();
            console.log("NEW PLAYER NAME: ", newPlayer.name);
            if(newPlayer.playerNumber === 1) {
                setPlayer({ x: newPlayer.x, y: newPlayer.y });
            }
            else if(newPlayer.playerNumber === 2) {
                setPlayer2({ x: newPlayer.x, y: newPlayer.y });
            }
            else if(newPlayer.playerNumber === 3) {
                setPlayer3({ x: newPlayer.x, y: newPlayer.y });
            }
            else if(newPlayer.playerNumber === 4) {
                setPlayer4({ x: newPlayer.x, y: newPlayer.y });

            }
            /*
            if(newPlayer.id === playerID) {
                setPlayer({ x: newPlayer.x, y: newPlayer.y })
            }
            else{
                setPlayer2({x: newPlayer.x, y: newPlayer.y })
            }
            */
        })

        _onChildRemoved(allPlayersRef, (data) => {
            console.log("             ")
            console.log("PLAYER HAS BEEN DISCONNECTED...")
            console.log(data.val());
            console.log(data.key);
            const playerData = data.val();
            const removedPlayerID = playerData.id;
            const playerNumber = playerData.playerNumber;
            const isHost = playerData.host;

            if(playerNumber === 1) {
                setPlayer("OPEN");
            }
            else if(playerNumber === 2) {
                setPlayer2("OPEN");
            }
            else if(playerNumber === 3) {
                setPlayer3("OPEN");
            }
            else if (playerNumber === 4) {
                setPlayer4("OPEN");
            }



            //HANDLE IF HOST HAS DISCONNECTED
           
            
            let newHostID = null;

            if(isHost) {
                Object.keys(players).forEach((player) => {
                    if (removedPlayerID !== player) {
                        newHostID = player;
                    }
                })
            }

            if(newHostID !== null) {
                if(playerID === newHostID) {
                    console.log("YOUR ARE THE NEW HOST !");
                    players[playerID].host = true;
                    _set(playerRef, players[playerID]);

                }
            }
            

        })
    }

    function signIn() {
        
        _onAuthStateChanged(auth, (user) => {
            //console.log(user);
            if (user) {
                //User is signed in...
                console.log(user.uid)
                //playerID = user.uid;
                setOnline(true);

                playerID = user.uid;
                myPlayerNumber = -1;
                playerRef = _ref(db, `players/${playerID}`);
                //const hostRef = _ref(db, 'host/');
                

                _onDisconnect(playerRef).remove();
                //_onDisconnect(hostRef).remove();

                Game();
            }
            else {
                //User is signed out...
            }

        })
        
        _signInAnonymously(auth)
            .then(() => {
                // Signed in..
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ...
            });
    
    }

    function getNextHost() {
        console.log("GETTING HOST....................");

        console.log("STATE CHECK: ",player);
        //console.log("STATE CHECK 2: ", player2 !== "OPEN");

        if(player !== "OPEN") {
            return 1;
        }
        else if(player2 !== "OPEN") {
            return 2;
        }
        else if (player3 !== "OPEN") {
            return 3;
        } 
        else if (player4 !== "OPEN") {
            return 4;
        }


        return 0;
    }

    function getOpenSpot() {
        console.log(player);
        if(player === "OPEN") {
            console.log("Spot 1 is available...")
            return 1;
        }
        else if(player2 === "OPEN") {
            console.log("Spot 2 is available...")
            return 2;
        }
        else if (player3 === "OPEN") {
            console.log("Spot 3 is available...")
            return 3;
        }
        else if (player4 === "OPEN") {
            console.log("Spot 4 is available...")
            return 4;
        }
        console.log("GAME IS FULL!");
        return 0;
    }

    function handleSubmit(event) {
        event.preventDefault();

        console.log("SUBMITTED...")
        setUsername(true);
        const username = name;

        let openSpot = getOpenSpot();
        console.log("OPENSPOT:", openSpot)
        //console.log(playerRef);

        //playerRef = _ref(db, `players/${playerID}`);
        
        myPlayerNumber = openSpot;

        const hostRef = _ref(db, 'host');
        /*
        if(players === null) {
            console.log("THERE IS NO ONE IN THE LOBBY CURRENTLY!")
            _set(hostRef, {
                player: 1
            })
        }
        */
      

        _set(playerRef, {
            id: playerID,
            name: username,
            x: 0,
            y: 0,
            playerNumber: openSpot,
            host: players === null ? true : false,
            //maze: {1: 1,2:2,3:3},
        })
        
    }

    function handleChange(event) {
        event.preventDefault();
        setName(event.target.value);
    }

    function startGame() {

    }

    function createNewMaze() {

    }
    
    return(
        <div>
            {(online && !hasUsername) && 
                <form onSubmit={handleSubmit} >
                    <label style={{color: "white"}}>
                        Name:
                        <input type="text" value={name} onChange={handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            }
            {hasUsername && <h1 style={{ color: 'white' }}>Welcome {name}</h1>}
            {/*host && <h1 style={{ color: 'white' }}>You are the HOST !</h1>*/}
            <div className='main-container'>
                <Maze
                    mode={""}
                    //key={this.state.createMaze}
                    player={player}
                    player2={player2}
                    player3={player3}
                    player4={player4}
                    //setMazeInfo={this.setMazeInfo}
                    handleOnKeyDown={handleOnKeyDown}
                    //handleOnKeyUp={this.handleOnKeyUp}
                    rows={30}
                    columns={30}
                //start={this.state.start}
                />

                <Sidebar
                    mode={"Multiplayer"}
                    start={start}
                    newMaze={newMaze}
                    multiplayerHost={host}

                //setStart={this.startGame()}
                //createNewMaze={this.createNewMaze()}
                />
            </div>
        </div>
    )
}

export default Multiplayer;