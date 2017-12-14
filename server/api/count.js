
const express = require('express')
const router = express()
const { createWebAPIRequest } = require('../../NeteaseCloudMusicApi/util/util')

router.post('/', (req, res) => {
  const cookie = req.get('Cookie') ? req.get('Cookie') : ''
  const csrf = req.cookies['__csrf']
  const data = {
    csrf_token: csrf,
  }

  createWebAPIRequest(
    'music.163.com',
    `/weapi/pl/count?csrf_token=${csrf}`,
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
