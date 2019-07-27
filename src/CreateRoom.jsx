import React, { Component } from 'react';
import { connect } from 'react-redux';

class CreateRoom extends Component {
  constructor() {
    super();
    this.state = {
      roomName: '',
    };
  }
  handleNameChange = (evt) => {
    this.setState({ roomName: evt.target.value });
  };
  handleSubmit = (evt) => {
    evt.preventDefault();
    const formData = new FormData();
    formData.append('roomName', this.state.roomName);
    fetch('/create-room', {
      method: 'POST',
      credentials: 'same-origin',
      body: formData,
    });
  };
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          onChange={this.handleNameChange}
          value={this.state.roomName}
        />
        <input type="submit" />
      </form>
    );
  }
}

export default connect()(CreateRoom);
