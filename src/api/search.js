import { commonParams } from './config'
import axios from 'axios'

const debug = process.env.NODE_ENV !== 'production'

// 获取热门搜索的数据
export function getHotKeyList() {
  const url = debug ? '/api/getHotKey' : 'http://www.dengmingwei.com/music/api/getHotKey'
  const data = Object.assign({}, commonParams, {
    '-': (Math.random() + '').replace('0.', ''),
    data: {
      comm: {
        g_tk: 5381, uin: '', format: 'json', inCharset: 'utf-8', outCharset: 'utf-8', notice: 0, platform: 'h5', needNewCode: 1
      },
      MusicHallHomePage: {
        module: 'music.musicHall.MusicHallPlatform',
        method: 'MobileWebHome',
        param: {
          ShelfId: [101, 102, 161]
        }
      },
      hotkey: {
        module: 'tencent_musicsoso_hotkey.HotkeyService',
        method: 'GetHotkeyForQQMusicMobile',
        param: {
          remoteplace: 'txt.miniapp.wxada7aab80ba27074', searchid: '1559616839293'
        }
      }
    }
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

// 获取搜索结果数据
export function getSearchResult({ query = '', page = 1, perpage = 20, zhida }) {
  const url = debug ? '/api/getSearchResult' : 'http://www.dengmingwei.com/music/api/getSearchResult'
  const data = Object.assign({}, commonParams, {
    '-': (Math.random() + '').replace('0.', ''),
    uin: 0,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    w: query,
    zhidaqu: 1,
    catZhida: zhida ? 1 : 0,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage,
    n: perpage,
    p: page,
    remoteplace: 'txt.mqq.all'
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
