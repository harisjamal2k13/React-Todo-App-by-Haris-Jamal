import React from 'react';
// import {Button} from './Button';
export let List = (props) => {
    return (
        <ul>
            {
                props.list.length > 0 ?
                    props.list.map((data, indx) => {
                        return (
                            <li keys={indx}>
                                <span>{data}</span>
                                <span>
                                    <button onClick = {()=>{props.editItem(data, indx)}}>edit</button>
                                    <button onClick ={()=>{props.deletItem(indx)}}>delete</button>                                    
                                </span>
                                {/* <span>
                                    <Button classNaam = "for-icons" text = {<Image imageURL = {edit} />} clickFunc = {props.editFunc}/>
                                    <Button classNaam = "for-icons" text = {<Image imageURL = {delte} />} clickFunc = {props.deleteFunc}/>
                                </span> */}
                            </li>
                        );
                    })
                    :
                    <h1>Empty List</h1>
            }
        </ul>
    );
}