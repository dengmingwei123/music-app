function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) - min)
}

export const shuffle = function (arr) {
  const _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    const result = getRandomInt(0, i)
    // 进行交换
    const j = _arr[i]
    _arr[i] = _arr[result]
    _arr[result] = j
  }

  return _arr
}
