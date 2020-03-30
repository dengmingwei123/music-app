import { commonParams, options } from './config'
import jsonp from 'common/js/jsonp'
import axios from 'axios'

export function getRankList() {
  const url = '/api/getRankList'
  const data = Object.assign({}, commonParams, {
    '-': (Math.random() + '').replace('0.', ''),
    data: {
      comm: {
        g_tk: 5381, uin: '', format: 'json', inCharset: 'utf-8', outCharset: 'utf-8', notice: 0, platform: 'h5', needNewCode: 1, ct: 23, cv: 0
      },
      topList: {
        module: 'musicToplist.ToplistInfoServer', method: 'GetAll', param: {}
      }
    }
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getMusicList(topId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, commonParams, {
    topid: topId,
    needNewCode: 1,
    uin: 0,
    tpl: 3,
    page: 'detail',
    type: 'top',
    platform: 'h5'
  })

  return jsonp(url, data, options)
}
