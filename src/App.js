import React, { Component } from 'react';
import './App.css';
import { Draggable, Droppable } from 'react-drag-and-drop';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onChildAdded, onChildChanged, onChildRemoved, push, set, remove } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyB48RUYT9bKIXEJ8XYzPaeYm5S36shZxsk",
  authDomain: "reactjs-todo-fb.firebaseapp.com",
  databaseURL: "https://reactjs-todo-fb.firebaseio.com",
  projectId: "reactjs-todo-fb",
  storageBucket: "reactjs-todo-fb.appspot.com",
  messagingSenderId: "345591402811",
  appId: "1:345591402811:web:1cbcb4540d62f8555b671e"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const Database = ref(database, 'Todo With Drag and Drop');

class App extends Component {
    constructor() {
        super();
        this.state = {
            todo_list: {
                Todo: [],
                Doing: [],
                Review: [],
                Done: []
            }
        };
        this.add_todo_item = this.add_todo_item.bind(this);
    }

    todoType = [
        "Todo",
        "Doing",
        "Review",
        "Done"
    ];

    database_events(todoType) {
        onChildAdded(ref(database, `Todo With Drag and Drop/${todoType}/`), (snapshot) => {
            let x;
            if (this.state.todo_list) x = this.state.todo_list;
            x[todoType].push({ key: snapshot.key, value: snapshot.val(), edit: false });
            this.setState({ todo_list: x });
        });

        onChildChanged(ref(database, `Todo With Drag and Drop/${todoType}/`), (snapshot) => {
            let x, index;
            if (this.state.todo_list) x = this.state.todo_list;
            for (let i = 0; i < x[todoType].length; i++) {
                if (x[todoType][i].key === snapshot.key && x[todoType][i].edit === true)
                    index = i;
            }
            x[todoType][index].value = snapshot.val();
            x[todoType][index].edit = false;
            this.setState({ todo_list: x });
        });

        onChildRemoved(ref(database, `Todo With Drag and Drop/${todoType}/`), (snapshot) => {
            let x, index;
            if (this.state.todo_list) x = this.state.todo_list;
            for (let i = 0; i < x[todoType].length; i++) {
                if (x[todoType][i].key === snapshot.key && x[todoType][i].value === snapshot.val() && x[todoType][i].edit === false)
                    index = i;
            }
            x[todoType].splice(index, 1);
            this.setState({ todo_list: x });
        });
    }

    componentWillMount() {
        this.database_events(this.todoType[0]);
        this.database_events(this.todoType[1]);
        this.database_events(this.todoType[2]);
        this.database_events(this.todoType[3]);
    }

    add_todo_item(ev) {
        ev.preventDefault();
        push(ref(database, "Todo With Drag and Drop/Todo/"), this.refs.todo_item.value);
    }

    edit_todo_item = (todoType, index, ev) => {
        ev.preventDefault();
        let x = this.state.todo_list;
        x[todoType][index].edit = true;
        this.setState({ todo_list: x });
    }

    cancel_edit = (todoType, index, ev) => {
        ev.preventDefault();
        let x = this.state.todo_list;
        x[todoType][index].edit = false;
        this.setState({ todo_list: x });
    }

    update_todo_item = (todoType, firebase_key, index, ev) => {
        ev.preventDefault();
        set(ref(database, `Todo With Drag and Drop/${todoType}/${firebase_key}`), this.refs[`${todoType.toLowerCase()}_edit_item_${index}`].value);
    }

    delete_todo_item = (todoType, firebase_key, index, ev) => {
        ev.preventDefault();
        remove(ref(database, `Todo With Drag and Drop/${todoType}/${firebase_key}`));
    }

    on_drop_function = (todoType, data) => {
        let values = data.todo.split("/");
        if (values[0] !== todoType) {
            set(ref(database, `Todo With Drag and Drop/${todoType}/${values[1]}`), values[2]);
            remove(ref(database, `Todo With Drag and Drop/${values[0]}/${values[1]}`));
        }
    }

    todo_list_jsx = (todoType) => {
        return (
            <div className="mh-100 col">
                <div className="card text-white bg-warning mb-3">
                    <Droppable
                        types={['todo']} // <= allowed drop types 
                        onDrop={this.on_drop_function.bind(this, todoType)}>
                        <h3>{todoType}</h3>
                        <ul className="mh-100 list-group">
                            {
                                this.state.todo_list[todoType].map((v, i) => {
                                    return (
                                        (!v.edit) ?
                                            <Draggable key={i} type="todo" data={`${todoType}/${v.key}/${v.value}`}>
                                                <li className="list-group-item libg" key={i}>
                                                    <p>{v.value}</p>
                                                    &nbsp;
                                                    <button className="btn btn-secondary gry" onClick={this.edit_todo_item.bind(this, todoType, i)}>Edit</button>
                                                    &nbsp;
                                                    <button className="btn btn-danger redy" onClick={this.delete_todo_item.bind(this, todoType, v.key, i)}>Delete</button>
                                                </li>
                                            </Draggable>
                                            :
                                            <li className="list-group-item  active" key={i}>
                                                <form>
                                                    <div className="form-group">
                                                        <input className="form-control" type="text" ref={`${todoType.toLowerCase()}_edit_item_${i}`} defaultValue={v.value} />
                                                    </div>
                                                    <input className="btn btn-primary" type="submit" value="Save" onClick={this.update_todo_item.bind(this, todoType, v.key, i)} />
                                                    <button className="btn btn-secondary" onClick={this.cancel_edit.bind(this, todoType, v.key, i)}>Cancel</button>
                                                </form>
                                            </li>
                                    )
                                })
                            }
                        </ul>
                    </Droppable>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="container  text-center">
                <h1> TODO APP </h1>
                <br />
                <form>
                    <div className="row">
                        <div className="col-8">
                            <input className="form-control frmctrl" type="text" ref="todo_item" placeholder="Enter Todo" />
                            <input className="btn btn-primary btnpri" type="submit" value="Add Todo" onClick={this.add_todo_item} />
                        </div>
                    </div>
                </form>
                <hr />
                <div className="row">
                    {
                        this.todo_list_jsx(this.todoType[0])
                    }
                    {
                        this.todo_list_jsx(this.todoType[1])
                    }
                    {
                        this.todo_list_jsx(this.todoType[2])
                    }
                    {
                        this.todo_list_jsx(this.todoType[3])
                    }
                </div>
            </div>
        );
    }
}

export default App;
