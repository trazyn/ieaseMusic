const express = require('express')
const router = express()
const { createWebAPIRequest } = require('../../NeteaseCloudMusicApi/util/util')

router.get('/', (req, res) => {
  const cookie = req.get('Cookie') ? req.get('Cookie') : ''
  const id = req.query.id
  const csrf = req.cookies['__csrf']
  const data = {
    csrf_token: csrf,
    artistId: id,
    artistIds: [id],
  }

  console.log(data)

  createWebAPIRequest(
    'music.163.com',
    `/weapi/artist/unsub?csrf_token=${csrf}`,
    'POST',
    data,
    cookie,
    music_req => {
      res.send(music_req)
    },
    err => res.status(502).send('fetch error')
  )
})

module.exports = router