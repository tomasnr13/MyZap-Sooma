require("dotenv").config({ path: __dirname + "/.env" });
const { twitterClient } = require("./twitterClient.js")

const tweet = async () => {
  try {
    // await twitterClient.v2.listFollowed();
    await twitterClient.v2.tweet("This is a bot created for testing a proof of concept");
  } catch (e) {
    console.log(e)
  }
}

tweet();
