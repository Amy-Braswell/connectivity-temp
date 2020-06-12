import React, { useReducer, createContext } from 'react';
import jwtDecode from 'jwt-decode';

const initialState = {
  user: null
};

//////  COMMENTED OUT UNTIL GOOGLE ROUTE IS COMPLETE SO SITE DOESN'T BREAK ACCIDENTALLY ///////

// if (localStorage.getItem('jwtToken')) {
//   const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));
//   if (decodedToken.exp * 1000 < Date.now()) {
//     localStorage.removeItem('jwtToken');
//   } else {
//     initialState.user = decodedToken;
//   }
// } else if (localStorage.getItem('googleToken')) {
//   const decodedToken = jwtDecode(localStorage.getItem('googleToken'));
//   if (decodedToken.exp * 1000 < Date.now()) {
//     localStorage.removeItem('googleToken');
//   } else {
//     initialState.user = decodedToken;
//   }
// }


const AuthContext = createContext({
  user: null,
  googleUser: null,
  currentUser: null,
  isAuth: false,
  userEmail: null,
  login: (userData) => {},
  logout: () => {}
});

export function ContextReducer(state, { type, payload}) {
  switch (type) {
    case 'LOGIN':
      console.log('ran LOGIN case')
      console.log ('payload contains: ', payload)
      return {
        ...state,
        user: payload
      }
      ;
    case 'LOGOUT':
      console.log('ran LOGOUT case')
      return {
        ...state,
        user: null
      };
      // case 'LOGIN_GOOGLE_USER':
      // console.log('ran LOGIN_GOOGLE_USER case')
      // return {
      //   ...state,
      //   user: payload,
      // }
    // case 'IS_GOOGLE_USER_LOGGED_IN':
    //   console.log('ran IS_GOOGLE_USER_LOGGED_IN case')
    //   return {
    //     ...state,
    //     isAuth: payload,
    //   }
    default:
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(ContextReducer, initialState);

  function login(userData, currentUser) {
    localStorage.setItem('jwtToken', userData.token);
    dispatch({
      type: 'LOGIN',
      payload: userData || currentUser
    });
  }

  function logout() {
    localStorage.removeItem('jwtToken');
    dispatch({ type: 'LOGOUT' });
  }


  return (
    <AuthContext.Provider
    value={{ user: state.user, currentUser: state.currentUser, googleUser: state.googleUser, isAuth: state.isAuth, login, logout }}
    {...props}
    />
  );
}

export { AuthContext, AuthProvider };