require('dotenv').config();
const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const User = require('../models/User')

const { OAuth2Client } = require('google-auth-library')


module.exports = (context) => {
  const authHeader = context.req.headers.authorization;  
  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];
    console.log ('middleware token: ', token)
    if (token) {
      try {
        const user = jwt.verify(token, process.env.SECRET_KEY);
        return user;
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired token');
      }
    }
    throw new Error("Authentication token must be 'Bearer [token]");
  }
  throw new Error('Authorization header must be provided');
};

// module.exports = (context) => {
// Google needs async
// module.exports = (context) => {
//   const authHeader = context.req.headers.authorization;  
//   if (authHeader) {
//     const token = authHeader.split('Bearer ')[1];
//     const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID)
//     if (token) {
//       try {
//         const user = jwt.verify(token, process.env.SECRET_KEY);
//         console.log('user-middleware-controller-jwt-user: ', user)
//         return user
//       }   
//       catch {
//         // const ticket = client.verifyIdToken({
//           // Google needs async
//           const ticket =  client.verifyIdToken({
//             idToken: token,
//             audience: process.env.OAUTH_CLIENT_ID,
//           })
//           const googleUser = new User({
//             _id: ticket.payload._id,
//             email: ticket.payload.email, 
//             name: ticket.payload.name,
//             picture: ticket.payload.picture
//           });
//           const user = {
//             id: (googleUser._id).toString(),
//             email: googleUser.email, 
//             name: googleUser.name,
//             picture: googleUser.picture
//           };
//           console.log('user-middleware-controller-google-user: ', user)
//           return user
//         }

//       } 
//       // catch (err) {
//       //   throw new AuthenticationError('Invalid/Expired token');
//       // }

     
//     throw new Error("Authentication token must be 'Bearer [token]");
//   }
//   throw new Error('Authorization header must be provided');
// };









