const Mastodon = require('mastodon-api');

const mastodonClient = new Mastodon({
  access_token: process.env.MASTODON_ACCESS_TOKEN,
  api_url: `${process.env.MASTODON_BASE_URL}/api/v1/`
});

module.exports = mastodonClient;