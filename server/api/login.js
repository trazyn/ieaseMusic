const express = require('express')
const crypto = require('crypto')
const router = express()
const { createWebAPIRequest } = require('../../NeteaseCloudMusicApi/util/util')

router.get('/', (req, res) => {
  const email = req.query.email
  const cookie = req.get('Cookie') ? req.get('Cookie') : ''
  const md5sum = crypto.createHash('md5')
  const csrf = req.cookies['__csrf']
  md5sum.update(req.query.password)
  const data = {
    csrf_token: csrf,
    username: email,
    password: md5sum.digest('hex'),
    rememberLogin: 'true',
    clientToken:
      '1_F7ocLT2vWrl5GOeGAMJAeo/dbaD6E3PI_yI7eXDqSmN+pLichDRZKIJ57l7VvXdOg'
  }
  console.log('Data: %O', data)

  createWebAPIRequest(
    'music.163.com',
    `/weapi/login?csrf_token=${csrf}`,
    'POST',
    data,
    cookie,
    (music_req, cookie) => {
      res.set({
        'Set-Cookie': cookie
      })
      res.send(music_req)
    },
    err => res.status(502).send('fetch error')
  )
})

module.exports = router
