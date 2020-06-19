require('dotenv').config();
const { AuthenticationError } = require('apollo-server');
const { OAuth2Client } = require('google-auth-library')
const jwt = require('jsonwebtoken');
const User = require('../models/User')



// Controller to verify user for New Posts, Likes, Comments and Delete Button
module.exports = async (context) => {
  const authHeader = context.req.headers.authorization;  
  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];
    const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID)
    if (token) {
      // user logged in through app
      try {
        const user = jwt.verify(token, process.env.SECRET_KEY);
        console.log('user-middleware-controller-jwt-user: ', user)
        return user
      }  
      // user logged in through Google 
      catch {
          const ticket =  await client.verifyIdToken({
            idToken: token,
            audience: process.env.OAUTH_CLIENT_ID,
          })
          const googleUser = new User({
            _id: ticket.payload._id,
            email: ticket.payload.email, 
            name: ticket.payload.name,
            picture: ticket.payload.picture
          });
          const user = {
            id: (googleUser._id).toString(),
            email: googleUser.email, 
            name: googleUser.name,
            picture: googleUser.picture
          };
          console.log('user-middleware-controller-google-user: ', user)
          return user
        }
      } 
      // catch (err) {
      //   throw new AuthenticationError('Invalid/Expired token');
      // }
    throw new Error("Authentication token must be 'Bearer [token]");
  }
  throw new Error('Authorization header must be provided');
};









