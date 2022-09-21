import { useEffect } from 'react';
import { useState } from 'react';

import '../css/Background.css'


function Background (props) {

    const {hover} = props;

    let backgroundMaze = new Array(100).fill(0).map(() => new Array(100).fill(0));
    //let [ randomCell, setRandomCell ] = useState({x:-1, y:-1});

    let [cellSet, updateCellSet] = useState(new Set());
    let [cellSet2, updateCellSet2] = useState(new Set());

    //console.log(hover);
    useEffect(() => {
        let interval = null;

        console.log(hover);
        if(hover === "Solo Game" || hover === "Maze Training") {                
            interval = setInterval(() => {
                RandomCells();
            }, 100)                 
        }
        else if(hover === "PVP Game") {
            interval = setInterval(() => {
                RandomCellsDoubleSets();
            }, 100)   
        }
        /*
        else{
            updateCellSet(new Set())
        }
        */
        
        
        
        
        return () => { 
            clearInterval(interval);
            updateCellSet(new Set());
            updateCellSet2(new Set());
        }
        
    },[hover])

   


    function RandomCells() {
        console.log("RANDOM CELL FUNCTION")
        /*
        let randomX = Math.floor(Math.random() * 50);
        let randomY = Math.floor(Math.random() * 100);
        //setRandomCell({x:randomX, y:randomY});

        let newSet = new Set(cellSet);
        newSet.add(randomX.toString() + '-' + randomY.toString());
        updateCellSet(newSet);
        */
        let newSet = new Set();
        for(let cells = 0; cells < 50; cells++) {
            let randomX = Math.floor(Math.random() * 50);
            let randomY = Math.floor(Math.random() * 100);

            newSet.add(randomX.toString() + '-' + randomY.toString());
            
        }
        

        updateCellSet((set) => new Set([...set, ...newSet]) );


    }

    function RandomCellsDoubleSets() {
        console.log("RANDOM CELL FUNCTION")
        
        let newSet = new Set();
        for (let cells = 0; cells < 30; cells++) {
            let randomX = Math.floor(Math.random() * 50);
            let randomY = Math.floor(Math.random() * 50);

            newSet.add(randomX.toString() + '-' + randomY.toString());

        }


        updateCellSet((set) => new Set([...set, ...newSet]));

        let newSet2 = new Set();
        for (let cells = 0; cells < 30; cells++) {
            let randomX = Math.floor(Math.random() * 50);
            let randomY = Math.floor(Math.random() * (100 - 50) + 50);

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
                                                            cellSet.has(rowID.toString() + '-' + cellID.toString()) && hover === "PVP Game" ? 'blue' : 
                                                            cellSet2.has(rowID.toString() + '-' + cellID.toString()) && hover === "PVP Game" ? 'pink' : ""} `}
                        >
                            
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Background;