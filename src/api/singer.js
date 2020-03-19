import { commonParams } from './config'
import axios from 'axios'

// 获取歌单分类数据
export function getSingerCategories() {
  const url = '/api/getSingerCategories'
  const data = Object.assign({}, commonParams, {
    '-': 'getUCGI' + (Math.random() + '').replace('0.', ''),
    platform: 'yqq.json',
    format: 'json',
    needNewCode: 0,
    data: {
      comm: { ct: 24, cv: 0 },
      singerList: {
        module: 'Music.SingerListServer',
        method: 'get_singer_list',
        param: { area: -100, sex: -100, genre: -100, index: 23, sin: 0, cur_page: 1 }
      }
    }
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

// 获取歌手数据
export function getSingerList() {
  const url = '/api/getSingerList'
  const data = Object.assign({}, commonParams, {
    '-': 'getUCGI' + (Math.random() + '').replace('0.', ''),
    platform: 'yqq.json',
    format: 'json',
    needNewCode: 0,
    data: {
      comm: { ct: 24, cv: 0 },
      singerList: {
        module: 'Music.SingerListServer',
        method: 'get_singer_list',
        param: { area: -100, sex: -100, genre: -100, index: -100, sin: 0, cur_page: 1 }
      }
    }
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
