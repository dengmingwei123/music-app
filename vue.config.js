const path = require('path')
const axios = require('axios')
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

      // 获取歌手分类数据
      app.get('/api/getSingerCategories', function (req, res) {
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
            const tags = response.singerList.data && response.singerList.data.tags
            if (tags) {
              res.json({
                code: ERR_OK,
                data: tags
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

      // 获取歌手数据
      app.get('/api/getSingerList', function (req, res) {
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
            const singerList = response.singerList.data && response.singerList.data.singerlist
            if (singerList) {
              res.json({
                code: ERR_OK,
                data: singerList
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
    }
  },
  chainWebpack(config) {
    config.resolve.alias.set('common', resolve('src/common')).set('components', resolve('src/components')).set('api', resolve('src/api')).set('base', resolve('src/base'))
  }
}
