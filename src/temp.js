import React from 'react';
import { Button } from './Button';
import { List } from './list';
import { Input } from './input';


export class TodoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInput : "",
            dataItems :[]
        }
    }

    updateUserInput = (event) => {
        this.setState({
            userInput: event.target.value
        });
    }
    addList = () => {
        // let tempArray = [];
        // tempArray = this.state.dataItems;
        // tempArray.push(this.state.userInput);
        // this.setState({
        //     dataItems: tempArray,
        //     userInput: ''
        // });
        //cloning
        const {userInput, dataItems } = this.state;
        this.setState({
            userInput : '',
            dataItems : [...dataItems, userInput]
        })
    }
    // editItem = (data, indx) =>{
    //     let array = this.state.dataItems;
    //     let newValue = prompt('enter new value: ', data);
    //     // const {dataItems} = this.state.dataItems;
    //         if(newValue){
    //             dataItems[indx] = newValue;
    //             this.setState({
    //                 dataItems : dataItems
    //             });
    //         }
    // }
    deleteItem = (indx) =>{
        const array = this.state.dataItems;
        array.splice(indx, 1);
        this.setState({
            dataItems : array
        });
    } 
    editItem = (data, indx)=>{
        let array = this.state.dataItems;
        let newValue = prompt('enter new data: ', data);
        if(newValue){
            array[indx] = newValue;
            this.setState({
                dataItems : array
            })
        }
    }

    render() {
        return (
            <div>
                <Input inputType="text" fieldValue={this.state.userInput} onChangeFunc={this.updateUserInput} />
                <Button clickFunc={this.addList} text="add" />
                <List list = {this.state.dataItems} deletItem = {(i) =>{this.deleteItem(i)}} editItem = {(data, indx) =>{this.editItem(data, indx)}}/>
                
            </div>
        );
    }
}