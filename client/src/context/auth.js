import React, { useReducer, createContext, useContext } from 'react';
import jwtDecode from 'jwt-decode';
import { GraphQLClient } from 'graphql-request'
import { GOOGLE_USER_QUERY } from '../graphql.js/queries'

const initialState = {
  user: null
};

const AuthContext = createContext({
  user: null,
  returningUser: null,
  googleUser: null,
  photos: [],
  isAuth: false,
  userEmail: null,
  login: (userData) => {},
  setUserData: (returnedUser) => {},
  logout: () => {},
  updateUser: (userData) => {}
});

checkToken()

async function checkToken() {

  if (localStorage.getItem('jwtToken')) {
    const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));
    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem('jwtToken');
    } 
    if (decodedToken.iss) {
      const idToken = localStorage.getItem('jwtToken')
      const client = new GraphQLClient('http://localhost:5000/graphql', {
      headers: {
        authorization: idToken,
      }, 
    })
    // query the server (server verifies token, finds or creates a User, returns user's info)
      let returnedUser = await client.request(GOOGLE_USER_QUERY)
      let user = await returnedUser.user

      let normalizedUser = {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        city: user.city,
        state: user.state, 
        about: user.about,
        relation: user.relation, 
        picture: user.picture,
        banner: user.banner
      };
      initialState.user= normalizedUser

      console.log('normalized user initialState: ', initialState)
    }
    else {
      initialState.user = decodedToken;
      console.log('decoded token user initialState: ', initialState)
      }
    } 
    const returningUser = initialState.user
    console.log('user from initial state is: ', returningUser)
    return returningUser
  } 


function ContextReducer(state, { type, payload}) {
  switch (type) {
    case "CREATE_PHOTO":
      console.log('CREATE_PHOTO_CASE has run... payload is: ', payload)
      console.log('updated state is: ', state)
      return {
        ...state,
        newPicture: payload
      };
    case 'LOGIN':
      return {
        ...state,
        user: payload 
      }
      ;
    case 'SET_USER_DATA':
      return {
        ...state,
        user: payload
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
}



function AuthProvider(props) {
  const [state, dispatch] = useReducer(ContextReducer, initialState);

  function login(userData) {
    localStorage.setItem('jwtToken', userData.token || userData.tokenId)
    dispatch({
      type: 'LOGIN',
      payload: userData
    });
  }

  function setUserData(returnedUser) {
    dispatch({
      type: 'SET_USER_DATA',
      payload: returnedUser
    });
  }

  function logout() {
    localStorage.removeItem('jwtToken');
    dispatch({ type: 'LOGOUT' });
  }

  

  return (
    <AuthContext.Provider
    value={{ user: state.user, returningUser: state.user, photos: state.photos, googleUser: state.googleUser, isAuth: state.isAuth, checkToken, login, setUserData, logout, dispatch }}
    {...props}
    />
  );
}

export { AuthContext, AuthProvider, ContextReducer }