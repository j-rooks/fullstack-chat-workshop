import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: grid;
  background: dodgerblue;
  height: 50px;
  grid-template-columns: 1fr auto;
  align-items: center;
`;

const NavLink = styled(Link)`
  padding: 10px;
  color: #fff;
  text-decoration: none;
  &:hover {
    color: #ddd;
  }
`;

function Navbar(props) {
  const { setLogout } = props;
  return (
    <Wrapper>
      <div>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/direct-messages">Direct messages</NavLink>
        <NavLink to="/create-room">Create Room</NavLink>
      </div>
      <button onClick={setLogout}>Logout</button>
    </Wrapper>
  );
}

function handleLogout(dispatch) {
  fetch('/logout', { method: 'POST', credentials: 'same-origin' });
  dispatch({ type: 'LOGOUT' });
}

const mapDispatchToProps = (dispatch) => ({
  setLogout: () => handleLogout(dispatch),
});

export default connect(
  null,
  mapDispatchToProps
)(Navbar);
