import React, { Component } from 'react';
import { connect } from 'react-redux';

class ChatForm extends Component {
  constructor(props) {
    super(props);
    this.state = { message: '', image: null };
  }
  handleMessageChange = (event) => {
    console.log('new message', event.target.value);
    this.setState({ message: event.target.value });
  };
  handleImageChange = (event) => {
    this.setState({ image: event.target.files[0] });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    console.log('form submitted');
    let data = new FormData();
    data.append('msg', this.state.message);
    data.append('img', this.state.image);
    data.append('roomName', this.props.roomName);
    fetch('/newmessage', {
      method: 'POST',
      body: data,
      credentials: 'include',
    });
  };
  handleDelete = () => {
    fetch('/delete', { method: 'POST', credentials: 'same-origin' });
  };
  handleKick = () => {
    const username = window.prompt();
    const formData = new FormData();
    formData.append('username', username);
    fetch('/kick', {
      method: 'POST',
      body: formData,
      credentials: 'same-origin',
    });
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
