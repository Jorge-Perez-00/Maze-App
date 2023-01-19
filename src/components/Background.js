import { useEffect } from 'react';
import { useState } from 'react';

import '../css/Background.css'


let interval = null;

function Background (props) {

    const {hover} = props;

    let backgroundMaze = new Array(50).fill(0).map(() => new Array(50).fill(0));

    let [cellSet, updateCellSet] = useState(new Set());
    let [cellSet2, updateCellSet2] = useState(new Set());

    //console.log("Component is running...")
    useEffect(() => {

        //console.log(hover);
        if(hover === "Solo Game" || hover === "Maze Training" || hover === "Multiplayer") {                
            interval = setInterval(() => {
                RandomCells();
            }, 25)                 
        }
        else if (hover === "Player Vs Player") {
            interval = setInterval(() => {
                RandomCellsDoubleSets();
            }, 25)   
        }      
        
        return () => { 
            clearInterval(interval);
            updateCellSet(new Set());
            updateCellSet2(new Set());
        }
        
    },[hover])

   

    /*
        FUNCTION THAT WILL RANDOMLY LIGHT UP THE MAZE BACKGROUND WITH A SINGLE COLOR
    */
    function RandomCells() {
    
        let newSet = new Set();
        for(let cells = 0; cells < 30 /*50*/; cells++) {
            let randomX = Math.floor(Math.random() * 50);
            let randomY = Math.floor(Math.random() * 50);

            newSet.add(randomX.toString() + '-' + randomY.toString());
            
        }
        

        updateCellSet((set) => new Set([...set, ...newSet]) );

    }

    /*
        FUNCTION THAT WILL RANDOMLY LIGHT UP THE MAZE BACKGROUND WITH 2 DIFFERENT COLORS
    */
    function RandomCellsDoubleSets() {
        
        let newSet = new Set();
        for (let cells = 0; cells < 15/*30*/; cells++) {
            let randomX = Math.floor(Math.random() * 50);
            let randomY = Math.floor(Math.random() * 25);

            newSet.add(randomX.toString() + '-' + randomY.toString());

        }


        updateCellSet((set) => new Set([...set, ...newSet]));

        let newSet2 = new Set();
        for (let cells = 0; cells < 15/*30*/; cells++) {
            let randomX = Math.floor(Math.random() * 50);
            let randomY = Math.floor(Math.random() * (50 - 25) + 25);

            newSet2.add(randomX.toString() + '-' + randomY.toString());

        }


        updateCellSet((set) => new Set([...set, ...newSet]));
        updateCellSet2((set) => new Set([...set, ...newSet2]));


    }


    return (
        <div className="background-container">
            {backgroundMaze.map((row, rowID) =>
                <div key={rowID} className={"background-rows"}>
                    {row.map((value, cellID) =>
                        <div 
                            key={cellID} id={rowID + "-" + cellID} 
                            className={`background-cells ${cellSet.has(rowID.toString() + '-' + cellID.toString()) && hover === "Solo Game" ? 'blue' :
                                                            cellSet.has(rowID.toString() + '-' + cellID.toString()) && hover === "Maze Training" ? 'red' :
                                                            cellSet.has(rowID.toString() + '-' + cellID.toString()) && hover === "Multiplayer" ? 'special' :
                                                            cellSet.has(rowID.toString() + '-' + cellID.toString()) && hover === "Player Vs Player" ? 'blue' : 
                                                            cellSet2.has(rowID.toString() + '-' + cellID.toString()) && hover === "Player Vs Player" ? 'pink' : ""} `}
                        >
                            
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Background;