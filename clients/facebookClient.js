const Facebook = require('facebook-node-sdk');

const facebookClient = new Facebook({
  appID: process.env.FACEBOOK_APP_ID,
  appSecret: process.env.FACEBOOK_APP_SECRET,
  pageID: process.env.FACEBOOK_PAGE_ID,
  accessToken: process.env.FACEBOOK_ACCESS_TOKEN,
  version: process.env.FACEBOOK_VERSION
});

module.exports = facebookClient;
