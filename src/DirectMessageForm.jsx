import React, { Component } from 'react';

class DirectMessageForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      message: '',
    };
  }
  handleUsernameChange = (evt) => {
    this.setState({ username: evt.target.value });
  };
  handleMessageChange = (evt) => {
    this.setState({ message: evt.target.value });
  };
  handleSubmit = async (evt) => {
    evt.preventDefault();
    const formData = new FormData();
    formData.append('username', this.state.username);
    formData.append('message', this.state.message);
    const response = await fetch('/direct-message', {
      method: 'POST',
      credentials: 'same-origin',
      body: formData,
    });
    const body = await response.json();
    if (!body.success) alert(body.msg);
  };
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          onChange={this.handleUsernameChange}
          value={this.state.username}
        />
        <input
          type="text"
          onChange={this.handleMessageChange}
          value={this.state.message}
        />
        <button>Submit</button>
      </form>
    );
  }
}

export default DirectMessageForm;
