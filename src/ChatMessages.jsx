import React, { Component } from 'react';
import { connect } from 'react-redux';
import { timestampToString } from './utilities';

class ChatMessages extends Component {
  render = () => {
    const msgToElement = (message) => (
      <li>
        {timestampToString(message.timestamp)} - {message.username}:
        {message.message}
        {message.img && <img className="msg-img" src={message.img} />}
      </li>
    );
    return (
      <div>
        <ul>{this.props.messages.map(msgToElement)}</ul>
      </div>
    );
  };
}
const mapStateToProps = (state, props) => {
  return {
    messages: state.chatRooms[props.roomName].messages,
  };
};
export default connect(mapStateToProps)(ChatMessages);
