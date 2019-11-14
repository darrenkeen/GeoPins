const { OAuth2Client } = require('google-auth-library');

const User = require('../models/User');

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

const verifyAuthToken = async token => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.OAUTH_CLIENT_ID,
    });
    return ticket.getPayload();
  } catch (err) {
    console.error('Error verifying auth token', err);
  }
};

const checkIfUserExists = async email => User.findOne({ email }).exec();

const createNewUser = googleUser => {
  console.log(googleUser, 'googleUser');
  const { name, email, picture } = googleUser;
  const user = { name, email, picture };
  console.log(user);
  return new User(user).save();
};

exports.findOrCreateUser = async token => {
  const googleUser = await verifyAuthToken(token);
  const user = await checkIfUserExists(googleUser.email);
  return user || createNewUser(googleUser);
};