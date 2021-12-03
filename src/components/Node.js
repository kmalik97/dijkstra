import React from 'react'
import {useState,useEffect} from 'react';
import './Node2.css'; 

export default function Node({node,addWall,mouseDown,updateStart,moveStart,updateEnd,moveEnd}) {
    
    const [classState,setClassState] = useState('node');



    useEffect(() => {
        
        if(node.isStart){
            console.log(node);
            console.log("START NODE")
            setClassState('node start');
        }else if(node.isEnd){
            setClassState('node finish');
        }else if(node.isWall){
            setClassState('node-wall');
        }
        else{
            setClassState('node'); 
        }


    }, []) 
      
    const doSomething = () => {
        console.log(mouseDown)
        if(mouseDown){
            console.log("mouse over");
            addWall(node.row,node.col);    
        }
    }

    const updateToStartFinish = () => {
        if(moveStart){
            updateStart(node.row,node.col); 
        }
        if(moveEnd){
            updateEnd(node.row,node.col);
        }
    }
    
    return (
        <div onMouseDown={() => {updateToStartFinish()}} onMouseOver={()=> {doSomething()}} id={`node-${node.row}-${node.col}`} className={classState} >
        
        </div>
    )
}
