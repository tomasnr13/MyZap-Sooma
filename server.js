const express = require('express');
require("dotenv").config({ path: __dirname + "/.env" });
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const axios = require('axios');
app.use(bodyParser.json());

const twitterClient = require("./clients/twitterClient.js");
const mastodonClient = require("./clients/mastodonClient.js");

function write_file(id) {
  fs.writeFile('data/posts', String(id) + '\n', (err) => {
    if (err) {
      console.error('[FILES] Error creating posts file:', err);
    } else {
      console.log('[FILES] Posts file created with success!');
      console.log(`[FILES] Posts file updated with id ${id}!`);
    }
  });
}

async function post_check(id) {
  return new Promise((resolve, reject) => {
    fs.readFile('data/posts', 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log('[FILES] Posts file not found!');
          
          if (!fs.existsSync('data')){
            fs.mkdir('data', (err) => {
              if (err) {
                console.error('[FILES] Error creating data directory:', err);
              } else {
                console.log('[FILES] Data directory created successfully!');
                write_file(id);
                resolve(true);
              }
            });
          }
          else {
            write_file(id);
            resolve(true);
          }
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

      if (true){
        if (post.length > 280){
          console.log('[ERR] Post length surpasses limit imposed by Twitter')
        } else {  
          try {
            await twitterClient.v2.tweet(post);
          } catch (e) {
            console.log(e)
          }
          console.log(`[TWITTER] new tweet ${id} posted!`);
        }
      }

      if (true){
        
        if (post.length > 500){
          console.log('[ERR] Post length surpasses limit imposed by Mastodon')
        } else {

          const toot = {
            status: post
          };
          mastodonClient.post('statuses', toot, (err, data, response) => {
            if (err) {
              console.error(err);
            } else {
              console.log(`[FEDIVERSE] new post ${id} uploaded to Mastodon!`);
            }
          });
        }
      }

      if (true){  

        if (post.length > 63026){
          console.log('[ERR] Post length surpasses limit imposed by Facebook')
        }  else {

          axios.post("https://graph.facebook.com/v16.0/me/feed?access_token=EABf7JBfWxqMBAALCZAxsuzqicUaQGmT1flZCh7pddKFjq98ieaW4xlOb0ehLBEmXitUiL53ZCH9PaoZAlO6e0euv0lZBZCtAzK3cEOOnn4TExU9aDnTvJbqC2eZBEYzIcM6ACxWZChm9JKiO3aZCas8mqNMqsZAHwiuYtATF8KByRiNouTUgGB8M0mKZCQ1ne7hVzcZD"+process.env.FACEBOOK_ACCESS_TOKEN, {
            message: post
          })
          .then((response) => {
            console.log(`(ID: ${response.data.id})`);
            console.log(`[FACEBOOK] new post ${id} uploaded to Facebook page!`);
          })
          .catch((error) => {
            console.error(error);
          });
        }
      }
    }
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`[SERVER] listening on port ${port}`);
});