import React, { Component } from 'react';
import { timestampToString } from './utilities';

class DirectMessages extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    };
  }
  componentDidMount = () => {
    this.fetchMessages();
    this.fetchInterval = setInterval(this.fetchMessages, 500);
  };
  componentWillUnmount() {
    // Clear interval to avoid trying to set state if changed to a different route and component is not rendered
    clearInterval(this.fetchInterval);
  }
  fetchMessages = async () => {
    const response = await fetch('/direct-messages');
    const body = await response.json();
    if (body.success) {
      this.setState({ messages: body.messages });
    }
  };
  render() {
    return (
      <>
        <h1>Direct messages</h1>
        <ul>
          {this.state.messages.map((message) => (
            <li>
              {timestampToString(message.timestamp)} - {message.username}:
              {message.message}
            </li>
          ))}
        </ul>
      </>
    );
  }
}

export default DirectMessages;
