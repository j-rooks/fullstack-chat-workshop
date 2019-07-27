import React, { Component } from 'react';
import { connect } from 'react-redux';
import ChatMessages from './ChatMessages.jsx';
import ChatForm from './ChatForm.jsx';
import ActiveUsers from './ActiveUsers.jsx';

class ChatRoom extends Component {
  handleJoin = () => {
    fetch('/join?roomName=' + this.props.roomName, {
      method: 'POST',
      credentials: 'same-origin',
    });
  };
  handleLeave = () => {
    fetch('/leave?roomName=' + this.props.roomName, {
      method: 'POST',
      credentials: 'same-origin',
    });
  };
  render() {
    return (
      <>
        <h1>{this.props.roomName}</h1>
        {this.props.inChatRoom ? (
          <>
            <ActiveUsers roomName={this.props.roomName} />
            <ChatMessages roomName={this.props.roomName} />
            <ChatForm roomName={this.props.roomName} />
            <button onClick={this.handleLeave}>Leave</button>
          </>
        ) : (
          <button onClick={this.handleJoin}>Join</button>
        )}
      </>
    );
  }
}

const mapStateToProps = (state, props) => ({
  inChatRoom: state.chatRooms[props.roomName].users.includes(state.username),
});

export default connect(mapStateToProps)(ChatRoom);
