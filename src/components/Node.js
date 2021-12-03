import React from 'react'
import {useState,useEffect} from 'react';
import './Node2.css'; 

export default function Node({node}) {
    
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
      
    
    
    return (
        <div id={`node-${node.row}-${node.col}`} className={classState} >
        
        </div>
    )
}
