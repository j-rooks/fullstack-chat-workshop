import React from 'react';
import { connect } from 'react-redux';

function ActiveUsers(props) {
  const { messages, roomName } = props;
  const activeUsers = messages
    .filter(
      (message) =>
        Date.now() - message.timestamp < 5000 &&
        message.username !== 'Notification'
    )
    .reduce((acc, message) => (acc[message.username] = true && acc), {});
  return (
    <ul>
      {Object.keys(activeUsers).map((username) => (
        <li key={`active-${username}-${roomName}`}>{username}</li>
      ))}
    </ul>
  );
}

const mapStateToProps = (state, props) => ({
  messages: state.chatRooms[props.roomName].messages,
});

export default connect(mapStateToProps)(ActiveUsers);
