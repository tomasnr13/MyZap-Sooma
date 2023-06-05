require("dotenv").config({ path: __dirname + "/.env" });
const facebookClient = require("./clients/facebookClient.js");

const message = 'This is a test message.';

// const FB = require('fb');

// FB.setAccessToken('EABf7JBfWxqMBABrM1dpxvjlGc3kPzpnqvhCnaU23okGm6rlZBw1Qy5M8m0EzPgTA2f3XoHiSGi6l3JQKXiOM5gkOJUP5vZBFu9WqStLSAWbuYHNzVTwAK3TcFf1mZABwPTkTWiUwjJQuXKYG194Fee3ZB7SZBXynf95NkDVuyoiH6arRlMbuIPfjHmozHALPefRU7y9JBxZB1uvj9TxAuEc8vA5R8mIq8ZD');
// FB.api(
//   '/me/feed',
//   'POST',
//   { message: 'Testing with api' },
//   function (response) {
//     console.log(response);
//   }
// );

// facebookClient.api(
//   '/me/feed',
//   'POST',
//   {"message":message},
//   function(response) {
//       console.log(response)
//       // Insert your code here
//   }
// );

const axios = require('axios');

axios.post(process.env.FACEBOOK_REQUEST, {
  message: 'Hello, Worldz!',
})
.then((response) => {
  console.log(response.data.id);
})
.catch((error) => {
  console.error(error);
});
