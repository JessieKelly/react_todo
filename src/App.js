import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {TodoForm, TodoList, Footer} from './components/todo/';
import {addTodo, generateId, findById, toggleTodo, updateTodo, removeTodo, filterTodos} from './components/lib/todoHelpers'
import {loadTodos, createTodo, saveTodo} from './components/lib/todoService';
import PropTypes from 'prop-types';

class App extends Component {
  state = {
    todos: [],
    currentTodo: ''
  }

  static contextTypes = {
    route: PropTypes.string
}

  componentDidMount() {
    loadTodos()
      .then(todos => this.setState({todos}))
}

  constructor() {
    super();
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleEmptySubmit = this.handleEmptySubmit.bind(this)
  }

  handleSubmit(evt) {
    evt.preventDefault()
    const newId = generateId()
    const newTodo = {id: newId, name: this.state.currentTodo, isComplete: false}
    const updatedTodos = addTodo(this.state.todos, newTodo)
    this.setState({
      todos: updatedTodos,
      currentTodo: '',
      errorMessage: ''
    })
    createTodo(newTodo)
      .then(() => this.showTempMessage('Todo added'))
  }

  showTempMessage = (msg) => {
    this.setState({message: msg})
    setTimeout(() => this.setState({message: ''}), 2500)
  }

  handleEmptySubmit(evt) {
    evt.preventDefault()
    this.setState({
      errorMessage: 'Please supply the todo name'
    })
  }

  handleInputChange (evt) {
    this.setState({
      currentTodo: evt.target.value
    })
  }


handleToggle = (id) => {
  const todo = findById(id, this.state.todos)
  const getToggledTodo = () => toggleTodo(todo)
  const updated = getToggledTodo(id, this.state.todos)
  const getUpdatedTodos = updateTodo(this.state.todos)
  const updatedTodos = getUpdatedTodos(updated)
  this.setState({todos: updatedTodos})
  saveTodo(updated)
    .then(() => this.showTempMessage('Todo Updated'))
}

/*handleToggle = (id) => {
  const todo = findById(id, this.state.todos)
  const toggled = toggleTodo(todo)
  const updatedTodos = updateTodo(this.state.todos, toggled)
  this.setState({todos: updatedTodos})
}*/

handleRemove = (id, evt) => {
  evt.preventDefault()
  const updatedTodos = removeTodo(this.state.todos, id)
  this.setState({todos: updatedTodos})
}

  render() {
    const submitHandler = this.state.currentTodo ? this.handleSubmit : this.handleEmptySubmit
    const displayTodos = filterTodos(this.state.todos, this.context.route)
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2> A React Todo App by Jessie Kelly</h2>
        </div>
        <div className="Todo-App">
          {this.state.errorMessage && <span className='error'>{this.state.errorMessage}</span>}
          {this.state.message && <span className='success'>{this.state.message}</span>}
          <TodoForm handleInputChange={this.handleInputChange}
                    currentTodo={this.state.currentTodo}
                    handleSubmit={submitHandler} />
          <TodoList handleToggle={this.handleToggle}
            todos={displayTodos}
            handleRemove={this.handleRemove} />
          <Footer />
      </div>
    </div>
    );
  }
}

export default App;
