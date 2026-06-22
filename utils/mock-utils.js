/**
 * @module utils/mock-utils
 * @description Mock 工具函数模块
 * 提供本地缓存、延迟模拟、ID生成等通用功能，包括：
 * - 异步延迟模拟（mockAsync / mockError）
 * - 唯一ID生成（generateId）
 * - 本地缓存读写（getFromStorage / setToStorage）
 * - 数据初始化（initData，仅首次写入）
 * - 数组查找辅助（findById / findIndexById）
 * - 日期格式化（formatDate / formatDateTime / today / getWeekDates / randomDate）
 * - 随机数生成（randomInt / randomFloat / randomPick / randomPickN）
 */

var MOCK_DELAY_MIN = 200;
var MOCK_DELAY_MAX = 800;

/**
 * 模拟异步延迟，返回 Promise
 * @param {any} data - 要返回的数据
 * @param {number} delay - 延迟毫秒数（可选）
 * @returns {Promise}
 */
function mockAsync(data, delay) {
  var ms = delay || Math.floor(Math.random() * (MOCK_DELAY_MAX - MOCK_DELAY_MIN)) + MOCK_DELAY_MIN;
  return new Promise(function (resolve) {
    setTimeout(function () { resolve(data); }, ms);
  });
}

/**
 * 模拟异步延迟返回失败
 * @param {string} message - 错误信息
 * @param {number} delay - 延迟毫秒数
 * @returns {Promise}
 */
function mockError(message, delay) {
  var ms = delay || Math.floor(Math.random() * (MOCK_DELAY_MAX - MOCK_DELAY_MIN)) + MOCK_DELAY_MIN;
  return new Promise(function (_, reject) {
    setTimeout(function () { reject(new Error(message)); }, ms);
  });
}

/**
 * 生成唯一ID
 * @returns {string}
 */
function generateId() {
  return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * 从本地缓存读取数据
 * @param {string} key - 缓存键
 * @param {any} defaultValue - 默认值
 * @returns {any}
 */
function getFromStorage(key, defaultValue) {
  try {
    var data = wx.getStorageSync(key);
    return data !== '' ? data : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

/**
 * 写入本地缓存
 * @param {string} key - 缓存键
 * @param {any} data - 数据
 */
function setToStorage(key, data) {
  try {
    wx.setStorageSync(key, data);
  } catch (e) {
    console.error('缓存写入失败:', key, e);
  }
}

/**
 * 初始化数据到缓存（仅首次）
 * @param {string} key - 缓存键
 * @param {Function} mockFn - 生成mock数据的函数
 * @returns {any}
 */
function initData(key, mockFn) {
  var data = getFromStorage(key, null);
  if (!data) {
    data = mockFn();
    setToStorage(key, data);
  }
  return data;
}

/**
 * 在数组中根据ID查找项
 * @param {Array} arr
 * @param {string} id
 * @returns {object|undefined}
 */
function findById(arr, id) {
  return arr.find(function (item) { return item.id === id; });
}

/**
 * 在数组中根据ID查找并返回索引
 * @param {Array} arr
 * @param {string} id
 * @returns {number}
 */
function findIndexById(arr, id) {
  return arr.findIndex(function (item) { return item.id === id; });
}

/**
 * 随机生成日期字符串（在指定范围内）
 * @param {Date} start
 * @param {Date} end
 * @returns {string} YYYY-MM-DD
 */
function randomDate(start, end) {
  var d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return formatDate(d);
}

/**
 * 格式化日期为 YYYY-MM-DD
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  var y = date.getFullYear();
  var m = String(date.getMonth() + 1).padStart(2, '0');
  var d = String(date.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + d;
}

/**
 * 格式化日期时间为 YYYY-MM-DD HH:mm
 * @param {Date} date
 * @returns {string}
 */
function formatDateTime(date) {
  var dateStr = formatDate(date);
  var h = String(date.getHours()).padStart(2, '0');
  var min = String(date.getMinutes()).padStart(2, '0');
  return dateStr + ' ' + h + ':' + min;
}

/**
 * 从数组中随机选择一个元素
 * @param {Array} arr
 * @returns {any}
 */
function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 从数组中随机选择n个不重复的元素
 * @param {Array} arr
 * @param {number} n
 * @returns {Array}
 */
function randomPickN(arr, n) {
  var shuffled = [].concat(arr).sort(function () { return 0.5 - Math.random(); });
  return shuffled.slice(0, n);
}

/**
 * 随机整数
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 随机浮点数（保留两位小数）
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function randomFloat(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

/**
 * 获取今天的日期字符串
 * @returns {string} YYYY-MM-DD
 */
function today() {
  return formatDate(new Date());
}

/**
 * 获取本周周一到周日的日期数组
 * @returns {Array<string>} YYYY-MM-DD 数组
 */
function getWeekDates() {
  var now = new Date();
  var day = now.getDay() || 7;
  var monday = new Date(now);
  monday.setDate(now.getDate() - day + 1);
  var dates = [];
  for (var i = 0; i < 7; i++) {
    var d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(formatDate(d));
  }
  return dates;
}

module.exports = {
  mockAsync: mockAsync,
  mockError: mockError,
  generateId: generateId,
  getFromStorage: getFromStorage,
  setToStorage: setToStorage,
  initData: initData,
  findById: findById,
  findIndexById: findIndexById,
  randomDate: randomDate,
  randomPick: randomPick,
  randomPickN: randomPickN,
  randomInt: randomInt,
  randomFloat: randomFloat,
  formatDate: formatDate,
  formatDateTime: formatDateTime,
  today: today,
  getWeekDates: getWeekDates,
};
