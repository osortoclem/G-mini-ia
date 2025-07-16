import axios from 'axios'
import cheerio from 'cheerio'

export default async function handler(req, res) {
  const { tag = 'pikachu' } = req.query
  const url = `https://rule34.xxx/index.php?page=post&s=list&tags=${encodeURIComponent(tag)}`
  
  try {
    const { data } = await axios.get(url)
    const $ = cheerio.load(data)
    
    const results = []
    
    $('span.thumb').each((i, el) => {
      const postId = $(el).find('a').attr('href')?.split('id=')[1]
      const imgThumb = $(el).find('img').attr('src')

      if (postId && imgThumb) {
        results.push({
          id: postId,
          thumb: `https:${imgThumb}`,
          postUrl: `https://rule34.xxx/index.php?page=post&s=view&id=${postId}`
        })
      }
    })

    res.status(200).json({ count: results.length, results })
  } catch (err) {
    res.status(500).json({ error: 'Error scraping rule34', details: err.message })
  }
}