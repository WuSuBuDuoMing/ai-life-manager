// 本地缓存封装模块
function get(key, defaultValue) {
  try { var v = wx.getStorageSync(key); return v !== '' && v !== undefined ? v : (defaultValue || null) }
  catch (e) { return defaultValue || null }
}
function set(key, value) {
  try { wx.setStorageSync(key, value); return true } catch (e) { return false }
}
function remove(key) { try { wx.removeStorageSync(key) } catch (e) {} }
function clear() { try { wx.clearStorageSync() } catch (e) {} }
function has(key) {
  try { return wx.getStorageSync(key) !== '' } catch (e) { return false }
}
function getSize() {
  try { var info = wx.getStorageInfoSync(); return info.currentSize || 0 } catch (e) { return 0 }
}
function getAllKeys() {
  try { return wx.getStorageInfoSync().keys || [] } catch (e) { return [] }
}
function getObject(key, defaultValue) {
  defaultValue = defaultValue || {}
  var v = get(key)
  if (v && typeof v === 'object') return v
  return defaultValue
}
function setObject(key, obj) {
  var existing = getObject(key, {})
  var merged = Object.assign({}, existing, obj)
  return set(key, merged)
}
function getList(key) {
  var v = get(key)
  return Array.isArray(v) ? v : []
}
function addToList(key, item) {
  var list = getList(key)
  list.push(item)
  return set(key, list)
}
function removeFromList(key, id) {
  var list = getList(key)
  list = list.filter(function(i) { return i.id !== id })
  return set(key, list)
}
function updateListItem(key, id, updates) {
  var list = getList(key)
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === id) { list[i] = Object.assign({}, list[i], updates); break }
  }
  return set(key, list)
}
module.exports = {
  get: get, set: set, remove: remove, clear: clear, has: has,
  getSize: getSize, getAllKeys: getAllKeys, getObject: getObject,
  setObject: setObject, getList: getList, addToList: addToList,
  removeFromList: removeFromList, updateListItem: updateListItem,
  /**
   * 获取缓存大小信息（KB）
   * @returns {{ used: number, limit: number, percentage: number }}
   */
  getStorageInfo: function() {
    try {
      var info = wx.getStorageInfoSync()
      var used = info.currentSize || 0
      var limit = info.limitSize || 10240
      return { used: used, limit: limit, percentage: Math.round(used / limit * 100) }
    } catch (e) {
      return { used: 0, limit: 10240, percentage: 0 }
    }
  },
  /**
   * 清除指定前缀的所有缓存
   * @param {string} prefix
   */
  clearByPrefix: function(prefix) {
    try {
      var keys = wx.getStorageInfoSync().keys || []
      keys.forEach(function(key) {
        if (key.indexOf(prefix) === 0) wx.removeStorageSync(key)
      })
    } catch (e) {}
  },
  /**
   * 批量设置缓存
   * @param {Object} data - { key: value, ... }
   */
  setBatch: function(data) {
    var keys = Object.keys(data)
    keys.forEach(function(key) {
      try { wx.setStorageSync(key, data[key]) } catch (e) {}
    })
  },
  /**
   * 批量获取缓存
   * @param {Array} keys
   * @returns {Object}
   */
  getBatch: function(keys) {
    var result = {}
    keys.forEach(function(key) {
      try { result[key] = wx.getStorageSync(key) } catch (e) { result[key] = null }
    })
    return result
  }
}
