//import db from './firebase'
//import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
//import { set } from 'firebase/database';

//import { onChildAdded, onChildRemoved, onValue } from 'firebase/database';

import Sidebar from './Sidebar'
import MessageBox from './MessageBox'

import { useEffect } from 'react';
import { useState } from 'react';
import { db, auth, _signInAnonymously, _onAuthStateChanged, _ref, _set, _onDisconnect, _onChildAdded, _onChildRemoved, _onValue } from './firebase'

import Maze from './Maze'
import '../css/Multiplayer.css'
import { serverTimestamp } from 'firebase/database';



let playerID;
let myPlayerNumber;
let playerRef;
let gameRef;
let gameInfoRef;
let mazeRef;
let gameInfo = {};
let players = {};
let spectator;

let userMode = null;
let GAME_ON = null;


let countdownChanges = 0;

const randomNames = ["Mario", "Luigi", "Toby", "Rick", "Morty", "Peter", "Homer", "Bart", "Joe", "Bot", "Master", "Billy", "King", "Queen"];


let playersInfo = {
    player1: {
        name: "?",
        ready: false,
        host: false,
    },
    player2: {
        name: "?",
        ready: false,
        host: false,
    },
    player3: {
        name: "?",
        ready: false,
        host: false,
    },
    player4: {
        name: "?",
        ready: false,
        host: false,
    }
};



function Multiplayer(props) {

    let [online, setOnline] = useState(false);
    let [ready, setReadyStatus] = useState(false);
    let [name, setName] = useState("")
    let [hasUsername, setUsername] = useState(false);


    let [countdown, setCountdown] = useState(0);
    let [maze, setMaze] = useState(new Array(30).fill(-9999).map(() => new Array(30).fill(-9999)))
    

    let [player, setPlayer] = useState("OPEN");
    let [player2, setPlayer2] = useState("OPEN");
    let [player3, setPlayer3] = useState("OPEN");
    let [player4, setPlayer4] = useState("OPEN");

    let [host, setHost] = useState(false);
    let [start, setStart] = useState(false);
    let [newMaze, setNewMaze] = useState(false);
    let [randomNumber, setRandomNumber] = useState(0);
    let [mazeType, setMazeType] = useState("")

    let [showInitialSetup, setInitialSetup] = useState(false);
    let [showMessage, setShowMessage] = useState(false);
    let [showForm, setShowForm] = useState(false);
    let [canJoin, setJoin] = useState(false);

    let [winner, setWinner] =  useState("");
    let [controls, setControls] = useState(false);

    //let playerID;
    //let playerRef;
   
    useEffect(() => {
        
        signIn();
       
        return () => {
           //signOut(auth);
        }
    },[])

    function handleOnKeyDown(event) {
        //console.log(event.key)
        //console.log(players[playerID].x);


        if (controls && spectator !== true) {
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

            if((positionX !== -1 && positionX !== 30) && (positionY !== -1 && positionY !== 30) && maze[positionX][positionY] !== -9999 ) {
                players[playerID].x = positionX;
                players[playerID].y = positionY;

                _set(playerRef, players[playerID]);

                if(positionX === 29 && positionY === 29) {
                    gameInfo.gameInfo = {
                        winner: players[playerID].name, //name,
                        startGame: false,
                    }

                    _set(gameRef, gameInfo);

                }
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

        }

    }

    function Game() {
        const allPlayersRef = _ref(db, 'players');
        //const gameInfoRef = _ref(db, 'game');
        const playersInfoRef = _ref(db, 'game/playersInfo');
        const mazeInfoRef = _ref(db, 'game/maze');
        const gameInfoRef = _ref(db, 'game/gameInfo');
        const serverTimeOffset_ref = _ref(db, '.info/serverTimeOffset');
        const countdownRef = _ref(db, 'countdown');

        let serverTimeOffset = 0;

        _onValue(serverTimeOffset_ref, (snapshot) => { 
            serverTimeOffset = snapshot.val() 
            console.log(serverTimeOffset);
        })

        



        _onValue(mazeInfoRef, (snapshot) => {
            console.log("MAZEINFOREF TEST: ", snapshot.val());
            gameInfo.maze = snapshot.val();
            if (gameInfo.maze !== undefined && gameInfo.maze !== null && gameInfo.maze !== {}) {
                let matrixFromObject = [];


                let row = 0;
                let totalRows = 30;
                while (row < totalRows) {
                    matrixFromObject = [...matrixFromObject, gameInfo.maze[row.toString()]]
                    row++;
                }
                //console.log(matrixFromObject);
                setMaze(matrixFromObject);
                setStart(false);
                setControls(false);
                if(spectator === false) {
                    players[playerID].x = 0;
                    players[playerID].y = 0;
                    _set(playerRef, players[playerID]);
                }
                
            }
            /*
                If there is no object in the firebase database that represents the maze than an empty maze will be created.
                This is used when a random player leaves. When a player leaves the maze in the database is deleted.
            */
            else {
                setMaze(new Array(30).fill(-9999).map(() => new Array(30).fill(-9999)));
                setStart(true);
            }
        })


        _onValue(gameInfoRef, (snapshot) => {
            console.log("GAMEINFOREF TEST: ", snapshot.val());
            gameInfo.gameInfo = snapshot.val();


            if(gameInfo.gameInfo.startGame !== null) {
                //setStart(true);
                //setControls(true);
                GAME_ON = gameInfo.gameInfo.startGame;
               
            }
            /*
            else {
                setStart(false);
            }
            */
            //console.log("PLAYERS:  ", Object.keys(players).length)
            if(/*Object.keys(players).length !== 0 && */gameInfo.gameInfo.winner !== "" && gameInfo.gameInfo.winner !== undefined && gameInfo.gameInfo.winner !== null) {
                const gameWinner = gameInfo.gameInfo.winner;
                console.log("WINNER IS ", gameWinner);
                setWinner(gameWinner);
                //setStart(false);
                setControls(false);
                setShowMessage(true)

                
                if(spectator === false) {
                    //HOST ONLY SECTION
                    if(players[playerID].host) {
                        gameInfo.playersInfo.readyPlayers = 0;
                        gameInfo.gameInfo.winner = null;
                        gameInfo.gameInfo.startGame = false;

                        _set(gameRef, gameInfo);
                    }
                    //const isReady = players[playerID].ready;
                    players[playerID].ready = false;

                    _set(playerRef, players[playerID]);

                    setReadyStatus(false);

                    /*
                    if(isReady) {
                        gameInfo.playersInfo.readyPlayers = gameInfo.playersInfo.readyPlayers - 1;
                        _set(gameRef, gameInfo);

                    }
                    */
                   
                }
                
            }

        })

        _onValue(playersInfoRef, (snapshot) => {
            console.log("PLAYERSINFOREF TEST: ", snapshot.val());
            gameInfo.playersInfo = snapshot.val();
            console.log("TOTAL PLAYERS IN GAME: ", gameInfo.playersInfo.totalPlayers);

            if(spectator && gameInfo.playersInfo !== null && gameInfo.playersInfo !== {}) {
                const maxPlayers = 3;
                if(gameInfo.playersInfo.totalPlayers === maxPlayers /*&& Object.keys(players).length === 3*/) {
                    console.log("CANNOT JOIN !")
                    setJoin(false);

                    setShowForm(false);
                }
               

                if((gameInfo.playersInfo.totalPlayers < maxPlayers)) {
                    console.log("YOU CAN JOIN !");
                    setJoin(true);
                    /*
                    if(!showInitialSetup) {
                        setInitialSetup(true);
                    }
                    */
                    
                }
            }

            if(spectator === false && gameInfo.playersInfo !== null && gameInfo.playersInfo !== {}) {
                //HOST ONLY SECTION
                if (players[playerID].host) {
                    let readyPlayerCount = gameInfo.playersInfo.readyPlayers;
                    let totalPlayerCount = gameInfo.playersInfo.totalPlayers;
                    if (readyPlayerCount === totalPlayerCount && totalPlayerCount > 1 && !GAME_ON) {
                        setNewMaze(true);
                        setMazeType("hide");
                    }
                    else {
                        setNewMaze(false);
                    }
                }
            }

            
        })

        /*
            COUNTDOWN
        */
        _onValue(countdownRef, (snapshot) => {
            console.log("COUNTDOWN!")
            const seconds = snapshot.val().seconds;
            const startTime = snapshot.val().startTime;

            console.log("REAL TIMESTART: ", startTime);
            console.log("TEST: ", startTime - serverTimeOffset);

            if(spectator === false && startTime !== 0) {
                if(players[playerID].host === true) {
                    countdownChanges = countdownChanges + 1;
                    console.log("Change CHECK: ", countdownChanges)
                }
                else {
                    countdownChanges = 2;
                }
            }
    
            if(spectator !== false && startTime !== 0) {
                countdownChanges = 2;
            }


            let count = 0;
            if(startTime !== 0 && countdownChanges === 2) {

                const countdownInterval = setInterval(() => {
                    if (spectator === false) {
                        if (players[playerID].ready === false) {
                            players[playerID].ready = true;
                            _set(playerRef, players[playerID]);
                            
                            let readyCount = gameInfo.playersInfo.readyPlayers;
                            gameInfo.playersInfo.readyPlayers = readyCount + 1;
                            _set(playersInfoRef, gameInfo.playersInfo);
                            
                        }
                    }
                    console.log("DATE NOW: ", Date.now());
                    console.log("START TIME: ", startTime);
                    const timeLeft = (seconds * 1000) - (Date.now() - startTime - serverTimeOffset);
                    console.log("TIMELEFT: ", timeLeft);
                    count += 1;
                    console.log("COUNT.......... ", count)
                    if (timeLeft < 1000) {
                        countdownChanges = 0;
                        clearInterval(countdownInterval);
                        console.log("0.0 left");
                        if (GAME_ON) {
                            setCountdown(0);
                            setStart(true);
                            setControls(true);
                        }

                        if (spectator === false) {
                            if(players[playerID].host) {
                                const COUNTDOWN_REF = _ref(db, 'countdown');

                                _set(COUNTDOWN_REF, {
                                    startTime: 0, //db.ServerValue.TIMESTAMP,
                                    seconds: 7
                                })
                            }
                        }
                        //setStart(true);
                        //setControls(true);
                    }
                    else {
                        console.log(`${Math.floor(timeLeft / 1000)}`) //.${timeLeft % 1000}`);
                        setCountdown(Math.floor(timeLeft / 1000));
                    }
                }, 100)
            }
            /*
            const interval = setInterval(() => {
                const timeLeft = (seconds * 1000) - (Date.now() - startTime - serverTimeOffset);
                if (timeLeft < 0) {
                    clearInterval(interval);
                    console.log("0.0 left");
                    if(GAME_ON) {
                        setStart(true);
                        setControls(true);
                    }

                    if(spectator === false) {
                        const COUNTDOWN_REF = _ref(db, 'countdown');

                        _set(COUNTDOWN_REF, {
                            startTime: 0, //db.ServerValue.TIMESTAMP,
                            seconds: 7
                        })
                    }
                    //setStart(true);
                    //setControls(true);
                }
                else {
                    console.log(`${Math.floor(timeLeft / 1000)}`) //.${timeLeft % 1000}`);
                    setCountdown(Math.floor(timeLeft / 1000));
                }
            }, 100)
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
                
                if(playerKey === playerID && playerData.host === true) {
                    setHost(true);
                }
                if (playerData.playerNumber === 1) {
                    setPlayer({ x: playerData.x, y: playerData.y, player: playerKey === playerID ? "you" : "other" });
                    playersInfo.player1.name = playerData.name;
                    playersInfo.player1.ready = playerData.ready;
                    playersInfo.player1.host = playerData.host;

                }
                else if (playerData.playerNumber === 2) {
                    setPlayer2({ x: playerData.x, y: playerData.y, player: playerKey === playerID ? "you" : "other" });
                    playersInfo.player2.name = playerData.name;
                    playersInfo.player2.ready = playerData.ready;
                    playersInfo.player2.host = playerData.host;
                }
                else if (playerData.playerNumber === 3) {
                    setPlayer3({ x: playerData.x, y: playerData.y, player: playerKey === playerID ? "you" : "other" });
                    playersInfo.player3.name = playerData.name;
                    playersInfo.player3.ready = playerData.ready;
                    playersInfo.player3.host = playerData.host;

                }
                else if (playerData.playerNumber === 4) {
                    setPlayer4({ x: playerData.x, y: playerData.y, player: playerKey === playerID ? "you" : "other" });
                    playersInfo.player4.name = playerData.name;
                    playersInfo.player4.ready = playerData.ready;
                    playersInfo.player4.host = playerData.host;

                }
        
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
            const ready = playerData.ready === true ? 1 : 0;

            if(playerNumber === 1) {
                setPlayer("OPEN");
                playersInfo.player1.name = "?";
                playersInfo.player1.ready = false;
                playersInfo.player1.host = false;

            }
            else if(playerNumber === 2) {
                setPlayer2("OPEN");
                playersInfo.player2.name = "?";
                playersInfo.player2.ready = false;
                playersInfo.player2.host = false;

            }
            else if(playerNumber === 3) {
                setPlayer3("OPEN");
                playersInfo.player3.name = "?";
                playersInfo.player3.ready = false;
                playersInfo.player3.host = false;
            }
            else if (playerNumber === 4) {
                setPlayer4("OPEN");
                playersInfo.player4.name = "?";
                playersInfo.player4.ready = false;
                playersInfo.player4.host = false;
            }

           
            
            /*
                SHOW INITIAL MESSAGE STUP BOX IF THE LAST PLAYER HAS BEEN DISCONNECTED. 
                IF THE LAST PLAYER DISCONNECTS THEN THE INITIAL MESSAGE BOX WILL GIVE ANY SPECTATORS THE ABILITY TO JOIN THE GAME.
            */
            if(spectator && Object.keys(players).length === 1) {
                setInitialSetup(true);
            }

            /*
                SHOW INITIAL MESSAGE SETUP BOX IF THERE IS A SINGLE PLAYER SPOT OPEN FOR A SPECTATOR TO JOIN.
            */
            if(spectator && Object.keys(players).length === 3) {
                setInitialSetup(true);

            }

            //HANDLE IF HOST HAS DISCONNECTED
            let newHostID = null;

            if(spectator === false) {
                if (isHost) {
                    Object.keys(players).forEach((player) => {
                        if (removedPlayerID !== player) {
                            newHostID = player;
                        }
                    })
                }

                if (newHostID !== null) {
                    if (playerID === newHostID) {
                        console.log("YOU ARE THE NEW HOST !");
                        players[playerID].host = true;
                        _set(playerRef, players[playerID]);
                        gameInfo.playersInfo.totalPlayers = gameInfo.playersInfo.totalPlayers - 1;
                        gameInfo.playersInfo.readyPlayers = gameInfo.playersInfo.readyPlayers - ready;
                        //gameInfo.maze = {};

                        /*
                            RESET THE GAME IF THE SECOND TO LAST PLAYER LEAVES THE APP
                        */
                        if(Object.keys(players).length === 1) {
                            gameInfo.gameInfo.startGame = false;
                            gameInfo.gameInfo.winner = null;
                            gameInfo.maze = {};
                            console.log("TESTTTTTT")
                        }
                        setControls(false);
                        console.log(gameInfo);
                        _set(gameRef, gameInfo);

                    }
                }
                else {
                    if (players[playerID].host === true) {
                        gameInfo.playersInfo.totalPlayers = gameInfo.playersInfo.totalPlayers - 1;
                        gameInfo.playersInfo.readyPlayers = gameInfo.playersInfo.readyPlayers - ready;
                        //gameInfo.maze = {};

                        /*
                            RESET THE GAME IF THE SECOND TO LAST PLAYER LEAVES THE APP
                        */
                        if (Object.keys(players).length === 2) {
                            gameInfo.gameInfo.startGame = false;
                            gameInfo.gameInfo.winner = null;
                            gameInfo.maze = {};
                        }
                        setControls(false);
                        _set(gameRef, gameInfo);
                    }
                }
            }

        })
    }

    function signIn() {
        
        _onAuthStateChanged(auth, (user) => {
            //console.log(user);
            if (user) {
                //User is signed in...
                console.log("SIGNED IN: ", user.uid)
                //playerID = user.uid;
                setOnline(true);
                setInitialSetup(true);

                playerID = user.uid;
                myPlayerNumber = -1;

                spectator = true;

                playerRef = _ref(db, `players/${playerID}`);
                gameInfoRef = _ref(db, `game/playersInfo`);
                gameRef = _ref(db, 'game/');                

                _onDisconnect(playerRef).remove();

                Game();
            }
            else {
                console.log("SIGNED OUT!")
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

    /*
        Function that will check all 4 players states and returns the first open spot. 
        return 1 if player is open,
        return 2 if player2 is open,
        return 3 if player3 is open,
        reutrn 4 if player4 is open,
        return 0 if there are no open spots and the game if full.
    */
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
        if(GAME_ON) {
            setReadyStatus(true);
        }

        setShowForm(false);         
        
        let username;
        if(name === "") {
            username = randomNames[Math.floor(Math.random() * randomNames.length)];
        }
        else {
            username = name;
        }

        spectator = false;
        let openSpot = getOpenSpot();
        
        
        myPlayerNumber = openSpot;
        
        let firstPlayer = players === null ? true : false;

        _set(playerRef, {
            id: playerID,
            name: username,
            x: 0,
            y: 0,
            playerNumber: openSpot,
            ready: false,
            host: players === null ? true : false,
        })

        /*
            SETUP THE GAME IF THE PLAYER THAT JUST JOINED THE SERVER IS THE FIRST ONE AND ONLY PLAYER WHO HAS JOINED.
        */
        if (firstPlayer) {
            _set(gameRef, {
                maze: {},
                gameInfo : {
                    winner: null,
                    startGame: false,
                },
                playersInfo: {
                    totalPlayers: 1,
                    readyPlayers: 0,
                }
            })
        }
        else {
            let playerCount = gameInfo.playersInfo.totalPlayers;
            gameInfo.playersInfo.totalPlayers = playerCount + 1;
            //_set(gameInfoRef, gameInfo.playersInfo);

            /*
            if(GAME_ON) {
                let readyCount = gameInfo.playersInfo.readyPlayers;
                gameInfo.playersInfo.readyPlayers = readyCount + 1;
                //_set(gameInfoRef, gameInfo.playersInfo);
            }
            */
            _set(gameInfoRef, gameInfo.playersInfo);

        }
        
        
    }

    function handleChange(event) {
        event.preventDefault();
        setName(event.target.value);
    }

    function setReady() {
        //UPDATE READY STATUS IN DATABASE
        players[playerID].ready = true;
        _set(playerRef, players[playerID]);

        //UPDATE READY TOTAL PLAYERS COUNT
        let readyCount = gameInfo.playersInfo.readyPlayers;
        gameInfo.playersInfo.readyPlayers = readyCount + 1;
        _set(gameInfoRef, gameInfo.playersInfo);

        //UPDATE READY STATUS LOCALLY
        setReadyStatus(true);
    }

    function startGame(event) {
        event.preventDefault();
        setNewMaze(false);
        
        gameInfo.gameInfo = {
            winner: null,
            startGame: true, 
        }

        _set(gameRef, gameInfo);
        

        const COUNTDOWN_REF = _ref(db, 'countdown');

        //console.log("SERVERTIMESTAMP: ", serverTimestamp())
        _set(COUNTDOWN_REF, {
            startTime: serverTimestamp(), //db.ServerValue.TIMESTAMP,
            seconds: 10
        })

    }

    function setMazeInfo(mazeData) {        
        //SET MAZE IN FIREBASE REALTIME DATABASE
        let mazeObject = {};

        mazeData.map((row, rowID) => {
            mazeObject[rowID] = row
        })
        
        gameInfo["maze"] = mazeObject;

        _set(gameRef, gameInfo);
    }

    function createNewMaze() {
        setRandomNumber(randomNumber === 0 ? 1 : 0);
    }

    function removeMessageBox() {
        setShowMessage(false);
    }
    
    function onSpectateClicked() {
        console.log("YOU ARE A SPECTATOR!")
        setInitialSetup(false);
    }

    function onJoinClicked() {
        console.log("YOU WILL JOIN !")
        setInitialSetup(false);
        setShowForm(true);
    }

    return(
        <div>
            {(online && /*!hasUsername*/ showForm) &&
                <>
                    <div className='background-box' >

                    </div>
                    <div className='form-container'>
                        <form onSubmit={handleSubmit} >
                            <label>
                                Enter Name: 
                                <input type="text" value={name} onChange={handleChange} maxLength={7} />
                            </label>
                            <input type="submit" value="Enter" />
                        </form>
                    </div> 
                </>
               
            }

            
            {/*countdown !== 0 && <h1 style={{color: "white"}} >{countdown}</h1>*/}
            <MessageBox 
                open={showInitialSetup}
                message={"Welcome!"}
                buttons={[{text: "Spectate", onClick: onSpectateClicked, className: "enabled"}, {text: "Join", onClick: canJoin ? onJoinClicked : null, className: canJoin ? "enabled" : "disabled-join"}]}
            />

            <MessageBox
                open={showMessage}
                message={`Winner is ${winner}`}
                buttons={[{ text: "Close", onClick: removeMessageBox, className: "enabled" }]}
            />

            <div className='main-container'>
                <Maze
                    mode={mazeType}
                    key={randomNumber}
                    player={player}
                    player2={player2}
                    player3={player3}
                    player4={player4}
                    multiplayerMaze={maze}
                    setMazeInfo={setMazeInfo}
                    handleOnKeyDown={handleOnKeyDown}
                    //handleOnKeyUp={this.handleOnKeyUp}
                    rows={30}
                    columns={30}
                    start={start && controls}
                    countdown={countdown}
                />

                <Sidebar
                    mode={"Multiplayer"}
                    start={start}
                    newMaze={newMaze}
                    multiplayerHost={host}
                    playersInfo={playersInfo}
                    hasUsername={hasUsername}
                    ready={ready}
                    setReady={setReady}
                    setStart={startGame}
                    createNewMaze={createNewMaze}
                />
            </div>
        </div>
    )
}

export default Multiplayer;