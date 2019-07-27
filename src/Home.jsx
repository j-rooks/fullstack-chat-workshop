import React, { Component } from 'react';
import { connect } from 'react-redux';
import ChatRoom from './ChatRoom.jsx';

class Home extends Component {
  componentDidMount() {
    this.updateChatRooms();
    setInterval(this.updateChatRooms, 500);
  }
  updateChatRooms = async () => {
    const response = await fetch('/chatrooms');
    const body = await response.json();
    if (body.success) {
      this.props.dispatch({ type: 'SET_CHATROOMS', chatRooms: body.chatRooms });
    } else {
      this.props.dispatch({ type: 'LOGOUT' });
    }
  };
  render() {
    return (
      <>
        {Object.keys(this.props.chatRooms).map((roomName) => (
          <ChatRoom roomName={roomName} key={roomName} />
        ))}
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return { chatRooms: state.chatRooms };
};
export default connect(mapStateToProps)(Home);
