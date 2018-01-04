
const express = require('express')
const router = express()
const { createWebAPIRequest } = require('../../NeteaseCloudMusicApi/util/util')

router.get('/', (req, res) => {
  const cookie = req.get('Cookie') ? req.get('Cookie') : ''
  const data = {
    csrf_token: ''
  }
  console.log({ cookie })
  createWebAPIRequest(
    'music.163.com',
    `/weapi/login/token/refresh`,
    'POST',
    data,
    cookie,
    (music_req, cookie) => {
      if (cookie) {
        cookie = cookie.filter(x => !x.startsWith('MUSIC_U="";'))
        cookie = cookie.map(x => x.replace("Domain=.music.163.com", ""))

        res.set({
          'Set-Cookie': cookie
        })
      }

      res.send(music_req)
    },
    err => res.status(502).send('fetch error')
  )
})

module.exports = router
