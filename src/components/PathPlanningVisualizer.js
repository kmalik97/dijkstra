import React from "react";
import { useState, useEffect } from "react";
import Node from "./Node";
import "./PathPlanningVisualizer.css";
import Button from "@mui/material/Button";
import { dijkstra, getNodesInShortestPathOrder } from "./dijkstra";

import Grid from "@mui/material/Grid";

// const START_GRID_ROW = 10;
// const START_GRID_COL = 10;
// const END_GRID_ROW = 10;
// const END_GRID_COL = 20;

export default function PathPlanningVisualizer() {
  const [GRID_ROW, setGridRow] = useState(40);
  const [GRID_COL, setGridCol] = useState(40);

  const [START_GRID_COL,setStartGridCol] = useState(10);
  const [START_GRID_ROW,setStartGridRow] = useState(10);
  const [END_GRID_ROW,setEndGridRow] = useState(20);
  const [END_GRID_COL,setEndGridCol] = useState(20);
  const [moveStartClicked,setMoveStartClicked] = useState(false);
  const [moveEndClicked,setEndClicked] = useState(false); 
  const [randWeight, setRandWeight] = useState(false)

  const [board, setBoard] = useState([]);

  const [mouseDown, setMouseDown] = useState(false);

  const createNode = (col, row,rand) => {
    
    return {
      col,
      row,
      previousNode: null,
      distance: Infinity,
      value : rand ? Math.floor(Math.random() * (5 - 1 + 1) + 1) : 1,
      isStart: col === START_GRID_COL && row === START_GRID_ROW,
      isEnd: col === END_GRID_COL && row === END_GRID_ROW,
    };
  };

  const resetGrid = (rand) => {
    const grid = [];
    for (let row = 0; row < GRID_ROW; row++) {
      const currentRow = [];
      for (let col = 0; col < GRID_COL; col++) {
        currentRow.push(createNode(col, row,rand));
      }
      grid.push(currentRow);
    }
    setBoard(grid);
  };

  useEffect(() => {
    console.log("Initalizing Grid");
    resetGrid(randWeight);
  }, []);

  const handleButtonClick = () => {
    console.log("Button Click");
    // let row = Math.floor(Math.random() * GRID_ROW);
    // let col = Math.floor(Math.random() * GRID_COL);
    // document.getElementById(`node-${row}-${col}`).className ='node wall';
    const startNode = board[START_GRID_ROW][START_GRID_COL];
    const endNode = board[END_GRID_ROW][END_GRID_COL];
    const visitedNodesInOrder = dijkstra(board, startNode, endNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(endNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node visited";
      }, 10 * i);
    }
  };

  const animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node shortest-path";
      }, 50 * i);
    }
  };

  const getNewGridWithWallToggled = (row, col) => {
    const newGrid = board.slice();
    const node = newGrid[row][col];

    if (node.isStart || node.isEnd) {
      return;
    }

    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    if (newNode.isWall) {
      document.getElementById(`node-${node.row}-${node.col}`).className =
        "node wall";
    } else {
      document.getElementById(`node-${node.row}-${node.col}`).className =
        "node";
    }

    newGrid[row][col] = newNode;
    setBoard(newGrid);
  };

  const moveStart = () => {

    setMoveStartClicked(true); 
    const newGrid = board.slice();
    const node = newGrid[START_GRID_ROW][START_GRID_COL];
    const newNode = {
        ...node,
        isStart: false,
      };
      newGrid[START_GRID_ROW][START_GRID_COL] = newNode;
      setBoard(newGrid);
      document.getElementById(`node-${START_GRID_ROW}-${START_GRID_COL}`).className =
        "node";
  };
    
  const updateStart = (row,col) => {
    console.log("Update Start Pressed"); 
    setMoveStartClicked(false);
    const newGrid = board.slice();
    const node = newGrid[row][col];

    const newNode = {
      ...node,
      isStart: true,
    };
    setStartGridCol(col);
    setStartGridRow(row);
    document.getElementById(`node-${node.row}-${node.col}`).className =
        "node start";
    newGrid[row][col] = newNode;
    setBoard(newGrid);
  }

  const resetNodeWeights = () => {
    setRandWeight(!randWeight)
    resetGrid(randWeight)
  }

  const moveEnd = () => {

    setEndClicked(true); 
    const newGrid = board.slice();
    const node = newGrid[END_GRID_ROW][END_GRID_COL];
    const newNode = {
        ...node,
        isEnd: false,
      };
      newGrid[END_GRID_ROW][END_GRID_COL] = newNode;
      setBoard(newGrid);
      document.getElementById(`node-${END_GRID_ROW}-${END_GRID_COL}`).className =
        "node";
  };
    
  const updateEnd = (row,col) => {
    console.log("update end"); 
    setEndClicked(false);
    const newGrid = board.slice();
    const node = newGrid[row][col];

    const newNode = {
      ...node,
      isEnd: true,
    };
    setEndGridCol(col);
    setEndGridRow(row);
    document.getElementById(`node-${node.row}-${node.col}`).className =
        "node finish";
    newGrid[row][col] = newNode;
    setBoard(newGrid);
  }
  return (
    <div>
      <Grid container direction="column" spacing={1}>
        <Grid item container direction="row" spacing={4}>
          <Grid item>
            <Button
              variant="contained"
              onClick={() => {
                handleButtonClick();
              }}
            >
              Run Dijstra's Algorithm
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                window.location.reload(false);
              }}
            >
              Reset Grid
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                resetNodeWeights();
              }}
            >
              Random Weights
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                moveStart();
              }}
            >
              Move Start
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                moveEnd();
              }}
            >
              Move End
            </Button>
          </Grid>
        </Grid>

        <Grid item>
          <div
            onMouseDown={() => {
              setMouseDown(true);
            }}
            onMouseUp={() => {
              setMouseDown(false);
            }}
          >
            {board.map((row, rowId) => {
              return (
                <div className="row" key={rowId}>
                  {row.map((node, colId) => {
                    return (
                      <Node
                        node={node}
                        addWall={getNewGridWithWallToggled}
                        mouseDown={mouseDown}
                        updateStart={updateStart}
                        moveStart={moveStartClicked}
                        updateEnd={updateEnd}
                        moveEnd={moveEndClicked}
                      ></Node>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
