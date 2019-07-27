import React, { Component } from 'react';
import { connect } from 'react-redux';

class ChatForm extends Component {
  constructor(props) {
    super(props);
    this.state = { message: '', image: null };
  }
  handleMessageChange = (event) => {
    this.setState({ message: event.target.value });
  };
  handleImageChange = (event) => {
    this.setState({ image: event.target.files[0] });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    console.log('form submitted');
    let data = new FormData();
    data.append('message', this.state.message);
    data.append('img', this.state.image);
    data.append('roomName', this.props.roomName);
    fetch('/newmessage', {
      method: 'POST',
      body: data,
      credentials: 'include',
    });
  };
  handleDelete = () => {
    fetch('/delete?roomName=' + this.props.roomName, {
      method: 'POST',
      credentials: 'same-origin',
    });
  };
  handleKick = async () => {
    const username = window.prompt();
    if (!username) return;
    const formData = new FormData();
    formData.append('username', username);
    formData.append('roomName', this.props.roomName);
    const response = await fetch('/kick', {
      method: 'POST',
      body: formData,
      credentials: 'same-origin',
    });
    const body = await response.json();
    if (!body.success) alert(body.message);
  };
  render = () => {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            onChange={this.handleMessageChange}
            value={this.state.message}
            type="text"
          />
          <input onChange={this.handleImageChange} type="file" />
          <button type="button" onClick={this.handleDelete}>
            Delete
          </button>
          <input type="submit" />
        </form>
        {this.props.isAdmin && (
          <button onClick={this.handleKick}>Kick user</button>
        )}
      </div>
    );
  };
}

const mapStateToProps = (state, props) => ({
  isAdmin: state.username === state.chatRooms[props.roomName].admin,
});

export default connect(mapStateToProps)(ChatForm);
