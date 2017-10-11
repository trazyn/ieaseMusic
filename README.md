# ieaseMusic

[![Build Status](https://travis-ci.org/trazyn/ieaseMusic.svg?branch=master)](https://travis-ci.org/trazyn/ieaseMusic)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/trazyn/ieaseMusic/master/LICENSE)


<img src="https://github.com/trazyn/ieaseMusic/blob/master/resource/128x128.png" />

> Icon by [octiviotti](https://octiviotti.deviantart.com/)

> Elegant NeteaseMusic desktop app, Rock with NeteaseMusic :metal:

> Built by Electron, React, MobX, JSS


不吹不黑这大概是目前最好的网易云音乐客户端了吧，精力有限没有适配`Windows`和 `Linux`。目前 `API` 由 [Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi) 提供(可能会自己重造轮子，全姿势解锁)。


## Preview

![preview](https://github.com/trazyn/ieaseMusic/blob/master/screenshots/preview.gif)

## Feature
- 帅
- 很帅
- 非常帅
- JSS Theme support
- OSX Friendly
- Cross Platform
- Keyboard support
- Desktop notifications
- Modern UI design
- 就这些吧，编不下去了

## 海外党网解锁请参考

[fengjueming/unblock-NeteastMusic](https://github.com/fengjueming/unblock-NeteastMusic)

解锁后播放音乐存在延时过高问题可以参考 [#4](https://github.com/trazyn/ieaseMusic/issues/4)

## Install

Download the last version on the [website](https://github.com/trazyn/ieaseMusic/releases/latest) or below.

#### Mac(10.9+)
[Download](https://github.com/trazyn/ieaseMusic/releases/download/v0.0.4/ieaseMusic-0.0.4-mac.dmg) the `.dmg` file.

#### Linux
[Download](https://github.com/trazyn/ieaseMusic/releases/download/v0.0.4/iease-music-0.0.4-x86_64.AppImage) the `.AppImage` file.

The AppImage needs to be made executable after download:
```
$ chmod u+x iease-music-0.0.4-x86_64.AppImage
```

#### Windows(Windows 7+ are supported, 64-bit only)
`等待填坑`

## Screenshots

![preview](https://github.com/trazyn/ieaseMusic/blob/master/screenshots/home.png)
![preview](https://github.com/trazyn/ieaseMusic/blob/master/screenshots/menu.png)
![preview](https://github.com/trazyn/ieaseMusic/blob/master/screenshots/nextup.png)
![preview](https://github.com/trazyn/ieaseMusic/blob/master/screenshots/player.png)
![preview](https://github.com/trazyn/ieaseMusic/blob/master/screenshots/artist.png)
![preview](https://github.com/trazyn/ieaseMusic/blob/master/screenshots/fm.png)
![preview](https://github.com/trazyn/ieaseMusic/blob/master/screenshots/playlist.png)
![preview](https://github.com/trazyn/ieaseMusic/blob/master/screenshots/preferences.png)

## Development
```
git submodule init
git submodule update
$ npm install
$ npm run dev
```

## Keyboard shortcuts

Description            | Keys
-----------------------| -----------------------
暂停/播放              | <kbd>Space</kbd>
上一曲                 | <kbd>Left</kbd>
下一曲                 | <kbd>Right</kbd>
音量加                 | <kbd>Up</kbd>
音量减                 | <kbd>Down</kbd>
喜欢歌曲               | <kbd>Cmd</kbd> <kbd>L</kbd>
播放历史记录           | <kbd>Cmd</kbd> <kbd>0</kbd> ... <kbd>9</kbd>
跳转首页               | <kbd>Shift</kbd> <kbd>Cmd</kbd> <kbd>H</kbd>
查看榜单               | <kbd>Shift</kbd> <kbd>Cmd</kbd> <kbd>T</kbd>
所有歌单               | <kbd>Shift</kbd> <kbd>Cmd</kbd> <kbd>P</kbd>
我的电台               | <kbd>Shift</kbd> <kbd>Cmd</kbd> <kbd>F</kbd>
菜单                   | <kbd>Shift</kbd> <kbd>Cmd</kbd> <kbd>M</kbd>
播放列表               | <kbd>Cmd</kbd> <kbd>P</kbd>
偏好设置               | <kbd>Cmd</kbd> <kbd>,</kbd>

其实这些在鼠标右键菜单上面都有，上面这些看看就好，我也没记住
![preview](https://github.com/trazyn/ieaseMusic/blob/master/screenshots/contextmenu.png)

## Question

目前接口上面~~收藏歌单和 `Follow` 用户暂时没有~~`(DONE)`，界面部分搜索和**评论**(貌似很多人不喜欢这个)没做，DJ界面不打算做，感觉内容质量较差，~~这部分旅游结束后进行~~(进行中)。

对于灰色版权受限的资源，想问下大佬们哪里能找到相关资源去爬取？

## TODO:
- [x] Home
- [x] Playlist
- [x] Top
- [x] My FM
- [x] User
- [x] Artist
- [x] Album
- [ ] Login with email
- [ ] Search
- [x] Login
- [x] Pllylist subscribe
- [x] Follow
- [ ] Flac high quality audio
- [ ] Resolve dead link(search form QQ music)
- [ ] Scrobble to Last.fm
- [ ] Comment（貌似很多人讨厌评论啊）
- [ ] Website

## License
还是 MIT 吧，懒得改了
