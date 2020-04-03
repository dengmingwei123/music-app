const path = require('path')
const axios = require('axios')
const bodyParser = require('body-parser')
const ERR_OK = 0
const ERR_OFF = -1

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  devServer: {
    open: true,
    before(app) {
      // 获取轮播图数据
      app.get('/api/getTopBanner', function (req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        const jumpPrefix = 'https://y.qq.com/n/yqq/album/'
        axios.get(url, {
          headers: {
            referer: 'https://u.y.qq.com/',
            host: 'u.y.qq.com'
          },
          params: req.query
        }).then(response => {
          response = response.data
          if (response.code === ERR_OK) {
            const slider = []
            const content = response.focus.data && response.focus.data.content
            if (content) {
              for (let i = 0; i < content.length; i++) {
                const item = content[i]
                const sliderItem = {}
                sliderItem.id = item.id
                sliderItem.linkUrl = jumpPrefix + item.jump_info.url + '.html'
                sliderItem.picUrl = item.pic_info.url
                slider.push(sliderItem)
              }
            }
            res.json({
              code: ERR_OK,
              data: {
                slider
              }
            })
          } else {
            res.json({
              code: ERR_OFF
            })
          }
        }).catch(err => {
          console.log(err)
        })
      })

      // 获取推荐歌单数据
      app.get('/api/getDiscList', function (req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://u.y.qq.com/',
            host: 'u.y.qq.com'
          },
          params: req.query
        }).then(response => {
          response = response.data
          const { code } = response
          if (code === ERR_OK) {
            const discList = response.recomPlaylist.data && response.recomPlaylist.data.v_hot
            if (discList) {
              res.json({
                code: ERR_OK,
                data: discList
              })
            } else {
              res.json(response)
            }
          } else {
            res.json({
              code: ERR_OFF
            })
          }
        }).catch(err => {
          console.log(err)
        })
      })

      // 获取歌词
      app.get('/api/getLyric', function (req, res) {
        const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then(response => {
          let result = response.data
          if (typeof result === 'string') {
            // 配置规则
            const reg = /^\w+\(({.+})\)$/
            const matches = result.match(reg)
            if (matches) {
              result = JSON.parse(matches[1])
            }
          }
          res.json(result)
        }).catch(err => {
          console.log(err)
        })
      })

      // 获取歌曲播放url
      app.post('/api/getPurlUrl', bodyParser.json(), function (req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'

        axios.post(url, req.body, {
          headers: {
            referer: 'https://y.qq.com/',
            origin: 'https://y.qq.com',
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then(response => {
          res.json(response.data)
        }).catch(err => {
          console.log(err)
        })
      })

      // 获取歌单详情数据
      app.get('/api/getSongList', function (req, res) {
        const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

        axios.get(url, {
          headers: {
            referer: 'https://u.y.qq.com/',
            host: 'u.y.qq.com'
          },
          params: req.query
        }).then(response => {
          response = response.data
          const { code } = response
          if (code === ERR_OK) {
            const songList = response.cdlist[0] && response.cdlist[0].songlist
            if (songList) {
              res.json({
                code: ERR_OK,
                data: songList
              })
            } else {
              res.json(response)
            }
          } else {
            res.json({
              code: ERR_OFF
            })
          }
        }).catch(err => {
          console.log(err)
        })
      })

      // 获取排行榜数据
      app.get('/api/getRankList', function (req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'

        axios.get(url, {
          headers: {
            referer: 'https://u.y.qq.com/',
            host: 'u.y.qq.com'
          },
          params: req.query
        }).then(response => {
          response = response.data
          const { code } = response
          if (code === ERR_OK) {
            const rankList = response.topList.data && response.topList.data.group
            if (rankList) {
              res.json({
                code: ERR_OK,
                data: rankList
              })
            } else {
              res.json(response)
            }
          } else {
            res.json({
              code: ERR_OFF
            })
          }
        }).catch(err => {
          console.log(err)
        })
      })

      // 获取热门搜索数据
      app.get('/api/getHotKey', function (req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://u.y.qq.com/',
            host: 'u.y.qq.com'
          },
          params: req.query
        }).then(response => {
          response = response.data
          const { code } = response
          if (code === ERR_OK) {
            const hotKeyList = response.hotkey.data && response.hotkey.data.vec_hotkey
            if (hotKeyList) {
              res.json({
                code: ERR_OK,
                data: hotKeyList
              })
            } else {
              res.json(response)
            }
          } else {
            res.json({
              code: ERR_OFF
            })
          }
        }).catch(err => {
          console.log(err)
        })
      })

      // 获取搜索结果数据
      app.get('/api/getSearchResult', function (req, res) {
        const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then(response => {
          response = response.data
          res.json(response)
        }).catch(err => {
          console.log(err)
        })
      })
    }
  },
  chainWebpack(config) {
    config.resolve.alias.set('common', resolve('src/common')).set('components', resolve('src/components')).set('api', resolve('src/api')).set('base', resolve('src/base'))
  },
  publicPath: ''
}
