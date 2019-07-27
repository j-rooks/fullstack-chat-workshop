import React from 'react';
import { connect } from 'react-redux';

function ActiveUsers(props) {
  const { messages } = props;
  const activeUsers = messages
    .filter((message) => Date.now() - message.timestamp < 5000)
    .reduce((acc, message) => (acc[message.username] = true && acc), {});
  return (
    <ul>
      {Object.keys(activeUsers).map((username) => (
        <li>{username}</li>
      ))}
    </ul>
  );
}

const mapStateToProps = (state, props) => ({
  messages: state.chatRooms[props.roomName].messages,
});

export default connect(mapStateToProps)(ActiveUsers);
