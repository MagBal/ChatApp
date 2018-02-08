import React, { Component } from "react";
import io from "socket.io-client";

import styles from "./App.css";

import MessageForm from "./MessageForm";
import MessageList from "./MessageList";
import UsersList from "./UsersList";
import UserForm from "./UserForm";

const socket = io("/");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { users: [], messages: [], text: "", name: "" };
  }

  // componentWillMount() {
  //   console.log('The component is ready to mount.');
  // }

  //zaimplementowanie funkcji nasłuchujących na wiadomości typu update i message
  componentDidMount() {
    socket.on("message", message => this.messageReceive(message));
    socket.on("update", ({ users }) => this.chatUpdate(users));
    //console.log('Mounting the component.');
  }
  
  // componentWillUpdate() {
  //  	console.log('Component updating.');
  // }

  // componentDidUpdate() {
  //   console.log('Component updated!');
  // }

  componentWillUnmount() {
    socket.removeListener("message", this.messageReceive);
    socket.removeListener("update", this.chatUpdate);
    socket.close();
    //console.log('Component removal.');
  }
  
  render() {
    return this.state.name !== "" ? this.renderLayout() : this.renderUserForm();
  } 

  messageReceive(message) {
    const messages = [message, ...this.state.messages];
    this.setState({ messages });
  }

  //Serwer każdorazowo będzie wysyłał tablicę z aktualną listą użytkowników.
  chatUpdate(users) {
    this.setState({ users });
  }

  handleMessageSubmit(message) {
    const messages = [message, ...this.state.messages];
    this.setState({ messages });
    socket.emit("message", message);
  }

  handleUserSubmit(name) {
    this.setState({ name });
    socket.emit("join", name);
  }

  renderLayout() {
    return (
      <div className={styles.App}>
        <div className={styles.AppHeader}>
          <div className={styles.AppTitle}>ChatApp</div>
          <div className={styles.AppRoom}>App room</div>
        </div>
        <div className={styles.AppBody}>
          <UsersList users={this.state.users} />
          <div className={styles.MessageWrapper}>
            <MessageList messages={this.state.messages} />
            <MessageForm
              onMessageSubmit={message => this.handleMessageSubmit(message)}
              name={this.state.name}
            />
          </div>
        </div>
      </div>
    );
  }
  renderUserForm() {
    return <UserForm onUserSubmit={name => this.handleUserSubmit(name)} />;
  }
}

export default App;