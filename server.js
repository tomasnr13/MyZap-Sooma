const express = require('express');
require("dotenv").config({ path: __dirname + "/.env" });
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const axios = require('axios');
app.use(bodyParser.json());

const { twitterClient } = require("./clients/twitterClient.js");
const mastodonClient = require("./clients/mastodonClient.js");

async function post_check(id) {
  return new Promise((resolve, reject) => {
    fs.readFile('data/posts', 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log('[FILES] Posts file not found, creating...');
          fs.writeFile('data/posts', String(id) + '\n', (err) => {
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
          fs.appendFile('data/posts', String(id) + '\n', (err) => {
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

app.post('/', async (req, res) => {
  const event = req.body;
  var id = event.post.current.id;
  console.log(`[SERVER] Post webhook received with post ${id}`);
  res.sendStatus(200);

  if (event.post.current.status == 'published'){

    let to_pub = await post_check(id);
    
    if (to_pub){
      var title = event.post.current.title;
      var text = event.post.current.plaintext;
  
      var post = title + '\n' + text;
      console.log('[INFO] Post: ' + post);


      try {
        await twitterClient.v2.tweet(post);
      } catch (e) {
        console.log(e)
      }
      console.log(`[TWITTER] new tweet ${id} posted!`);

      const toot = {
        status: post
      };
      mastodonClient.post('statuses', toot, (err, data, response) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`[FEDIVERSE] new toot ${id} uploaded to Mastodon!`);
        }
      });

      axios.post(process.env.FACEBOOK_REQUEST, {
        message: post,
      })
      .then((response) => {
        console.log(`[FACEBOOK] new post ${id} uploaded to Facebook page! (ID: {response.data.id})`);
      })
      .catch((error) => {
        console.error(error);
      });

    }
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`[SERVER] listening on port ${port}`);
});