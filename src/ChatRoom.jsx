import React, { Component } from 'react';
import { connect } from 'react-redux';
import ChatMessages from './ChatMessages.jsx';
import ChatForm from './ChatForm.jsx';
import ActiveUsers from './ActiveUsers.jsx';

class ChatRoom extends Component {
  render() {
    return (
      <>
        <h1>{this.props.roomName}</h1>
        <ActiveUsers roomName={this.props.roomName} />
        <ChatMessages roomName={this.props.roomName} />
        <ChatForm roomName={this.props.roomName} />
      </>
    );
  }
}

const mapStateToProps = (state, props) => ({
  room: state.chatRooms[props.roomName],
});

export default connect(mapStateToProps)(ChatRoom);
