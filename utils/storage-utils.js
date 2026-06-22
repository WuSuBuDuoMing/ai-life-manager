/**
 * @module utils/storage-utils
 * @description 本地缓存封装模块
 * 提供 wx.Storage 的高级封装，包括：
 * - 基础 CRUD（get/set/remove/clear/has）
 * - 对象操作（getObject/setObject）
 * - 列表操作（getList/addToList/removeFromList/updateListItem）
 * - 批量操作（setBatch/getBatch）
 * - 存储信息查询（getSize/getAllKeys/getStorageInfo）
 * - 按前缀清除（clearByPrefix）
 */

/**
 * 获取缓存值，不存在时返回默认值
 * @param {string} key - 缓存键
 * @param {any} [defaultValue=null] - 默认值
 * @returns {any} 缓存值或默认值
 */
function get(key, defaultValue) {
  try { var v = wx.getStorageSync(key); return v !== '' && v !== undefined ? v : (defaultValue || null) }
  catch (e) { return defaultValue || null }
}

/**
 * 设置缓存值
 * @param {string} key - 缓存键
 * @param {any} value - 缓存值
 * @returns {boolean} 是否设置成功
 */
function set(key, value) {
  try { wx.setStorageSync(key, value); return true } catch (e) { return false }
}

/**
 * 删除指定缓存
 * @param {string} key - 缓存键
 */
function remove(key) { try { wx.removeStorageSync(key) } catch (e) {} }

/**
 * 清除所有缓存
 */
function clear() { try { wx.clearStorageSync() } catch (e) {} }

/**
 * 检查缓存是否存在
 * @param {string} key - 缓存键
 * @returns {boolean}
 */
function has(key) {
  try { return wx.getStorageSync(key) !== '' } catch (e) { return false }
}

/**
 * 获取当前缓存使用量（KB）
 * @returns {number}
 */
function getSize() {
  try { var info = wx.getStorageInfoSync(); return info.currentSize || 0 } catch (e) { return 0 }
}

/**
 * 获取所有缓存键名
 * @returns {Array<string>}
 */
function getAllKeys() {
  try { return wx.getStorageInfoSync().keys || [] } catch (e) { return [] }
}

/**
 * 获取缓存对象，不存在或类型不匹配时返回默认值
 * @param {string} key - 缓存键
 * @param {Object} [defaultValue={}] - 默认值
 * @returns {Object}
 */
function getObject(key, defaultValue) {
  defaultValue = defaultValue || {}
  var v = get(key)
  if (v && typeof v === 'object') return v
  return defaultValue
}

/**
 * 合并更新缓存对象（浅合并）
 * @param {string} key - 缓存键
 * @param {Object} obj - 要合并的字段
 * @returns {boolean} 是否设置成功
 */
function setObject(key, obj) {
  var existing = getObject(key, {})
  var merged = Object.assign({}, existing, obj)
  return set(key, merged)
}

/**
 * 获取缓存列表，不存在时返回空数组
 * @param {string} key - 缓存键
 * @returns {Array}
 */
function getList(key) {
  var v = get(key)
  return Array.isArray(v) ? v : []
}

/**
 * 向缓存列表末尾添加元素
 * @param {string} key - 缓存键
 * @param {any} item - 要添加的元素
 * @returns {boolean} 是否设置成功
 */
function addToList(key, item) {
  var list = getList(key)
  list.push(item)
  return set(key, list)
}

/**
 * 根据 id 从缓存列表中删除元素
 * @param {string} key - 缓存键
 * @param {string} id - 元素ID
 * @returns {boolean} 是否设置成功
 */
function removeFromList(key, id) {
  var list = getList(key)
  list = list.filter(function(i) { return i.id !== id })
  return set(key, list)
}

/**
 * 根据 id 更新缓存列表中的元素（浅合并）
 * @param {string} key - 缓存键
 * @param {string} id - 元素ID
 * @param {Object} updates - 要更新的字段
 * @returns {boolean} 是否设置成功
 */
function updateListItem(key, id, updates) {
  var list = getList(key)
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === id) { list[i] = Object.assign({}, list[i], updates); break }
  }
  return set(key, list)
}

/**
 * 获取缓存大小信息
 * @returns {{ used: number, limit: number, percentage: number }}
 */
function getStorageInfo() {
  try {
    var info = wx.getStorageInfoSync()
    var used = info.currentSize || 0
    var limit = info.limitSize || 10240
    return { used: used, limit: limit, percentage: Math.round(used / limit * 100) }
  } catch (e) {
    return { used: 0, limit: 10240, percentage: 0 }
  }
}

/**
 * 清除指定前缀的所有缓存
 * @param {string} prefix - 缓存键前缀
 */
function clearByPrefix(prefix) {
  try {
    var keys = wx.getStorageInfoSync().keys || []
    keys.forEach(function(key) {
      if (key.indexOf(prefix) === 0) wx.removeStorageSync(key)
    })
  } catch (e) {}
}

/**
 * 批量设置缓存
 * @param {Object} data - { key: value, ... } 格式的键值对
 */
function setBatch(data) {
  var keys = Object.keys(data)
  keys.forEach(function(key) {
    try { wx.setStorageSync(key, data[key]) } catch (e) {}
  })
}

/**
 * 批量获取缓存
 * @param {Array<string>} keys - 缓存键列表
 * @returns {Object} { key: value, ... } 格式的键值对
 */
function getBatch(keys) {
  var result = {}
  keys.forEach(function(key) {
    try { result[key] = wx.getStorageSync(key) } catch (e) { result[key] = null }
  })
  return result
}

module.exports = {
  get: get, set: set, remove: remove, clear: clear, has: has,
  getSize: getSize, getAllKeys: getAllKeys, getObject: getObject,
  setObject: setObject, getList: getList, addToList: addToList,
  removeFromList: removeFromList, updateListItem: updateListItem,
  getStorageInfo: getStorageInfo,
  clearByPrefix: clearByPrefix,
  setBatch: setBatch,
  getBatch: getBatch
}
