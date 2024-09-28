
const { NestorService } = require('@nestor/service')
const portfinder = require('portfinder')
const express = require('express')

const app = express()

// routes
app.get('/list', (req, res) => {
  res.json({ endpoints: [
    {
      name: 'search_internet',
      description: 'Search the internet and returns list of url pages who matches. Only the url is returned not the content of the page',
      url: `${req.protocol}://${req.get('host')}/search`,
      parameters: [
        { name: 'q', type: 'string', description: 'The query to search for', required: true }
      ]
    },
    {
      name: 'fetch_content',
      description: 'Get the content of a webpage given its url',
      url: `${req.protocol}://${req.get('host')}/content`,
      parameters: [
        { name: 'url', type: 'string', description: 'The url of the webpage', required: true }
      ]
    }
  ]})
})

app.get('/search', (req, res) => {
  console.log(req.path, req.query)
  res.json({
    results: [
      'http://www.doesnotexist.com/butitmatches'
    ]
  })
})

app.get('/content', (req, res) => {
  console.log(req.path, req.query)
  res.json({
    content: '<div>The songs played during the concert were:</div><ul><ol>Alien</ol><ol>>A Forest (by The Cure)</ol><ol>New Order T-Shirt</ol></ul>'
  })
})

portfinder.getPort({ port: 3000 }, (err, port) => {

  app.listen(port, () => {
    
    console.log(`Nestor Internet Service is listening at http://localhost:${port}`)

    const nestorService = new NestorService('Nestor Internet Service Example', port, '/list')
    nestorService.start()

  })

})
