
const express = require('express')
const router = express()
const { createWebAPIRequest } = require('../../NeteaseCloudMusicApi/util/util')

router.get('/', (req, res) => {
  const cookie = req.get('Cookie') ? req.get('Cookie') : ''
  const csrf = req.cookies['__csrf']
  const songid = req.query.songid
  const sourceid = req.query.sourceid
  const time = +req.query.time
  const data = {
    csrf_token: csrf,
    logs: JSON.stringify([{
        action: 'play',
        json: {
            download: 0,
            end: 'playend',
            id: +songid,
            sourceId: sourceid.toString(),
            time,
            type: 'song',
            wifi: 0,
        }
    }])
  }

  createWebAPIRequest(
    'music.163.com',
    `/weapi/feedback/weblog?csrf_token=${csrf}`,
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
