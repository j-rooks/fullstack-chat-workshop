import React, { Component } from 'react';
import { connect } from 'react-redux';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }
  handleUsernameChange = (event) => {
    console.log('new username', event.target.value);
    this.setState({ username: event.target.value });
  };
  handlePasswordChange = (event) => {
    console.log('new password', event.target.value);
    this.setState({ password: event.target.value });
  };
  handleSubmit = async (evt) => {
    evt.preventDefault();
    console.log('signup form submitted');
    let data = new FormData();
    data.append('username', this.state.username);
    data.append('password', this.state.password);
    const response = await fetch('/signup', {
      method: 'POST',
      body: data,
      credentials: 'same-origin',
    });
    const body = await response.json();
    if (!body.success) return alert(body.message);
    this.props.dispatch({
      type: 'LOGIN_SUCCESS',
      username: this.state.username,
    });
  };
  render = () => {
    return (
      <form onSubmit={this.handleSubmit}>
        Username
        <input type="text" onChange={this.handleUsernameChange} />
        Password
        <input type="text" onChange={this.handlePasswordChange} />
        <input type="submit" />
      </form>
    );
  };
}

export default connect()(Signup);
