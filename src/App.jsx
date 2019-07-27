import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import Navbar from './Navbar.jsx';
import Home from './Home.jsx';
import DirectMessageForm from './DirectMessageForm.jsx';
import DirectMessages from './DirectMessages.jsx';
import CreateRoom from './CreateRoom.jsx';

class App extends Component {
  async componentDidMount() {
    const response = await fetch('/session');
    const body = await response.json();
    if (body.success) {
      this.props.dispatch({ type: 'LOGIN_SUCCESS', username: body.username });
    }
  }
  renderHome = () => {
    return <Home />;
  };
  renderDirectMessages = () => {
    return (
      <>
        <DirectMessages />
        <DirectMessageForm />
      </>
    );
  };
  renderCreateRoom = () => {
    return <CreateRoom />;
  };
  render() {
    if (this.props.lgin) {
      return (
        <BrowserRouter>
          <Navbar />
          <Route path="/" exact render={this.renderHome} />
          <Route path="/direct-messages" render={this.renderDirectMessages} />
          <Route path="/create-room" render={this.renderCreateRoom} />
        </BrowserRouter>
      );
    }
    return (
      <div>
        <h1>Signup</h1>
        <Signup />
        <h1>Login</h1>
        <Login />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return { lgin: state.loggedIn };
};
export default connect(mapStateToProps)(App);
