import React from 'react';



export let Input = (props)=>{
    return(
            <input className = {props.classNaam} type = {props.inputType} value = {props.fieldValue} onChange = {props.onChangeFunc}/>
    );
}