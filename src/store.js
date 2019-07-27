import { createStore } from 'redux';

const initialState = { loggedIn: false, username: '', chatRooms: {} };

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, loggedIn: true, username: action.username };
    case 'LOGOUT':
      return { ...state, loggedIn: false, username: '' };
    case 'SET_CHATROOMS':
      return {
        ...state,
        chatRooms: action.chatRooms,
      };
    default:
      return state;
  }
}

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
