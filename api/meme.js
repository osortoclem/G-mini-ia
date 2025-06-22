// archivo: api/meme.js (Next.js API Route o Express)
const fetch = require("node-fetch");

const subreddits = ['memes', 'dankmemes', 'wholesomememes'];

function isMedia(url) {
  return /\.(mp4|webm|jpg|jpeg|png|gif)$/i.test(url);
}

exports.handler = async (req, res) => {
  const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
  const redditUrl = `https://www.reddit.com/r/${subreddit}/hot.json?limit=50`;

  try {
    const response = await fetch(redditUrl);
    const json = await response.json();

    const posts = json.data.children
      .map(p => p.data)
      .filter(p => isMedia(p.url))
      .map(p => ({
        title: p.title,
        url: p.url,
        type: /\.(mp4|webm)$/i.test(p.url) ? 'video' : 'image'
      }));

    const meme = posts[Math.floor(Math.random() * posts.length)];

    if (!meme) return res.status(404).json({ error: 'No memes found' });

    res.status(200).json(meme);

  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};