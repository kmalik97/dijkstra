import React from "react";
import { useState, useEffect } from "react";
import Node from "./Node";
import "./PathPlanningVisualizer.css";
import Button from "@mui/material/Button";
import { dijkstra, getNodesInShortestPathOrder } from "./dijkstra";
import Slider from "@mui/material/Slider";

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";


const START_GRID_ROW = 10;
const START_GRID_COL = 10;
const END_GRID_ROW = 10;
const END_GRID_COL = 20;

export default function PathPlanningVisualizer() {



  const [GRID_ROW, setGridRow] = useState(50);
  const [GRID_COL, setGridCol] = useState(50);
    
  const [board, setBoard] = useState([]);

  const createNode = (col, row) => {
    return {
      col,
      row,
      previousNode: null,
      distance: Infinity,
      isStart: col === START_GRID_COL && row === START_GRID_ROW,
      isEnd: col === END_GRID_COL && row === END_GRID_ROW,
    };
  };

  const resetGrid = () => {
    const grid = [];
    for (let row = 0; row < GRID_ROW; row++) {
      const currentRow = [];
      for (let col = 0; col < GRID_COL; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    setBoard(grid);
  };

  useEffect(() => {
    console.log("Initalizing Grid");
    resetGrid();
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
                handleButtonClick();
              }}
            >
              Reset Grid
            </Button>
          </Grid>
        </Grid>
        

        <Grid item>
          {board.map((row, rowId) => {
            return (
              <div className="row" key={rowId}>
                {row.map((node, colId) => {
                  return <Node node={node}></Node>;
                })}
              </div>
            );
          })}
        </Grid>
      </Grid>
    </div>
  );
}
