const { OAuth2Client } = require('google-auth-library')
const User = require('../models/User')

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID)



const verifyAuthToken = async token => {
  // console.log('verifying Auth token in database...')
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.OAUTH_CLIENT_ID,
    })
    const googleUser = new User({
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
    return user
  } catch (err) {
    console.error('Error verifying auth token', err)
  }
}

const checkIfUserExists = async email => {
  return User.findOne({ email }).exec()
}


exports.findOrCreateUser = async token => {
  // console.log('Looking for Google user in database....')
  // verify auth token
  const googleUser = await verifyAuthToken(token)
  // check if User exists
  let user = await checkIfUserExists(googleUser.email)
  // console.log('Google User Found in database!')
  // if user exists, return them, otherwise create new User
  return {    
    ...user._doc,
    id: user._id,
    token 
  }
  || 
  createNewUser(googleUser)
}

const createNewUser = googleUser => {
  // console.log('createNewUser triggered...')
  const { name, email, picture } = googleUser
  const user = { name, email, picture }
  return new User(user).save()
}


