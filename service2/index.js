
const { NestorService } = require('@nestor/service')
const portfinder = require('portfinder')
const express = require('express')

const app = express()

// playlist
const playlist = {
  id: 0,
  songs: []
}

// routes
app.get('/list', (req, res) => {
  res.json([
    {
      name: 'create_playlist',
      description: 'Create a playlist',
      url: `${req.protocol}://${req.get('host')}/playlist/create`,
      parameters: [
        { name: 'title', type: 'string', description: 'The title of the playlist', required: true },
        { name: 'description', type: 'string', description: 'The description of the playlist', required: false }
      ]
    },
    {
      name: 'add_to_playlist',
      description: 'Add a song to a playlist',
      url: `${req.protocol}://${req.get('host')}/playlist/add`,
      parameters: [
        { name: 'playlistId', type: 'string', description: 'The id of the playlist', required: true },
        { name: 'songId', type: 'string', description: 'The id of the song', required: true }
      ]
    },
    {
      name: 'get_song_id',
      description: 'Get the id of a song given its title and artist',
      url: `${req.protocol}://${req.get('host')}/song/id`,
      parameters: [
        { name: 'title', type: 'string', description: 'The title of the song', required: true },
        { name: 'artist', type: 'string', description: 'The artist of the song', required: true }
      ]
    }
  ])
})

app.get('/playlist/create', (req, res) => {
  console.log(req.path, req.query)
  playlist.id = playlist.id + 1
  playlist.songs = []
  res.json({
    playlistId: playlist.id
  })
})

app.get('/playlist/add', (req, res) => {
  console.log(req.path, req.query)
  playlist.songs.push(req.query.songId)
  res.json({
    playlistId: playlist.id,
    length: playlist.songs.length
  })
})

app.get('/song/id', (req, res) => {
  console.log(req.path, req.query)
  if (req.query.title == 'Alien') {
    res.json({ songId: '1' })
  } else if (req.query.title == 'A Forest') {
    res.json({ songId: '2' })
  } else if (req.query.title == 'New Order T-Shirt') {
    res.json({ songId: '3' })
  } else {
    res.sendStatus(404)
  }
})

portfinder.getPort({ port: 3000 }, (err, port) => {

  app.listen(port, () => {
    
    console.log(`Nestor Music Service is listening at http://localhost:${port}`)

    const nestorService = new NestorService('Nestor Music Service Example', port, '/list')
    nestorService.start()

  })

})
