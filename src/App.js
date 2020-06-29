import React, { useState, useRef, useCallback, useReducer } from "react";
import produce from "immer";
import "./App.css";

const numRows = 25;
const numCols = 25;

const operations = [
  [0,1],[0, -1], [1,-1],[-1,1],[-1,-1], [1,0], [-1,0], [1,1]
];

const App = () => {

  const [running, setRunning] = useState(false);

  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(new Array(numCols).fill(0));
    }
    return rows;
  });

  const runningRef = useRef();
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGrid((g)=>{
      return produce(g, gridCopy => {
        for(let i=0;i<numRows;i++){
          for(let k=0;k<numCols;k++){
            let neighbors = 0;
            operations.forEach(([x,y])=>{
              const newI = i + x;
              const newK = k + y;
              if(newI >= 0 && newI < numRows && newK >=0 && newK < numCols){
                neighbors+=g[newI][newK];
              }
            })
            if(neighbors < 2 || neighbors > 3){
              gridCopy[i][k]=0;
            }
            else if(g[i][k]===0 && neighbors ===3){
              gridCopy[i][k]=1;
            }
          }
        }
      })
    });
    
    setTimeout(runSimulation, 100);
  }, []);

  const renders = useRef(0);

  return (
    <div>
      <button onClick={() => { 
        setRunning(!running);
        if(!running){
          runningRef.current=true;
          runSimulation(); 
        }        
        }}>{running ? 'Stop' : 'Start'}</button>
      <br /><br />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "black" : "",
                border: "solid 1px black",
              }}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = gridCopy[i][k] ? 0 : 1;
                })
                setGrid(newGrid);
              }}
            ></div>
          ))
        )}
        <br />
      </div>
      {/* <div>Renders: {renders.current++}</div> */}
    </div>
  );
};

export default App;
