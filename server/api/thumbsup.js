
const express = require('express')
const router = express()
const { createWebAPIRequest } = require('../../NeteaseCloudMusicApi/util/util')

router.get('/', (req, res) => {
  const cookie = req.get('Cookie') ? req.get('Cookie') : ''
  const csrf = req.cookies['__csrf']
  const cid = req.query.cid
  const tid = req.query.tid
  const like = !!+req.query.like
  const data = {
    csrf_token: csrf,
    commentId: cid,
    threadId: tid,
    like: like,
  }

  createWebAPIRequest(
    'music.163.com',
    `/weapi/v1/comment/${like ? 'like' : 'unlike'}?csrf_token=${csrf}`,
    'POST',
    data,
    `${cookie} osver=Version%2010.12.6%20(Build%2016G29); appver=1.5.9; os=osx; channel=netease;`,
    music_req => {
      res.send(music_req)
    },
    err => res.status(502).send('fetch error')
  )
})

module.exports = router
