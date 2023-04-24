const express = require('express');
require("dotenv").config({ path: __dirname + "/.env" });
const { twitterClient } = require("./twitterClient.js");
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

async function post_check(id) {
  return new Promise((resolve, reject) => {
    fs.readFile('posts', 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log('[FILES] Posts file not found, creating...');
          fs.writeFile('posts', String(id) + '\n', (err) => {
            if (err) {
              console.error('[FILES] Error creating posts file:', err);
              //reject(err);
              resolve(false);
            } else {
              console.log('[FILES] Posts file created with success!');
              console.log(`[FILES] Posts file updated with id ${id}!`);
              resolve(true);
            }
          });
        } else {
          console.error('[FILES] Error reading posts file:', err);
          //reject(err);
          resolve(false);
        }
      } else {
        const posts = data.split('\n');
        if (posts.includes(id)) {
          console.log(`[FILES] Post ${id} already added!`);
          resolve(false);
        } else {
          fs.appendFile('posts', String(id) + '\n', (err) => {
            if (err) {
              console.error('[FILES] Error updating posts file:', err);
              //reject(err);
              resolve(false);
            } else {
              console.log(`[FILES] Posts file updated with id ${id}!`);
              resolve(true);
            }
          });
        }
      }
    });
  });
}

app.get( '/', ( req, res ) => {
  res.send('Hello, this is socialtrigger!');
});

app.post('/webhook', async (req, res) => {
  const event = req.body;
  var id = event.post.current.id;
  console.log(`[SERVER] Post webhook received with post ${id}`);

  if (event.post.current.status == 'published'){

    let to_pub = await post_check(id);
    
    if (to_pub){
      var title = event.post.current.title;
      var text = event.post.current.plaintext;
  
      var tweetText = title + '\n' + text;
  
      console.log('[INFO] tweet: ' + tweetText);

      res.sendStatus(200);

      try {
        await twitterClient.v2.tweet(tweetText);
      } catch (e) {
        console.log(e)
      }
      console.log(`[TWITTER] new tweet ${id} posted!`);
      s
    }
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`[SERVER] listening on port ${port}`);
});