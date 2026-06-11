/**
 * 日期工具模块
 * 提供日期格式化、计算、比较等功能
 */

/**
 * 格式化日期
 * @param {Date|string} date - 日期对象或字符串
 * @param {string} [format='YYYY-MM-DD'] - 格式模板
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date, format) {
  format = format || 'YYYY-MM-DD'
  var d = _toDate(date)
  var y = d.getFullYear()
  var mo = String(d.getMonth() + 1).padStart(2, '0')
  var dy = String(d.getDate()).padStart(2, '0')
  var h = String(d.getHours()).padStart(2, '0')
  var mi = String(d.getMinutes()).padStart(2, '0')
  var s = String(d.getSeconds()).padStart(2, '0')
  return format.replace('YYYY', y).replace('MM', mo).replace('DD', dy).replace('HH', h).replace('mm', mi).replace('ss', s)
}

/**
 * 格式化日期时间
 * @param {Date|string} date - 日期
 * @returns {string} YYYY-MM-DD HH:mm 格式
 */
function formatDateTime(date) {
  return formatDate(date, 'YYYY-MM-DD HH:mm')
}

/**
 * 获取本周日期范围
 * @param {Date|string} [date] - 参考日期
 * @returns {{start: string, end: string}} 周一到周日的日期
 */
function getWeekRange(date) {
  var d = _toDate(date)
  var day = d.getDay()
  var diff = d.getDate() - day + (day === 0 ? -6 : 1)
  var mon = new Date(d)
  mon.setDate(diff)
  var sun = new Date(mon)
  sun.setDate(mon.getDate() + 6)
  return { start: formatDate(mon), end: formatDate(sun) }
}

/**
 * 获取本月日期范围
 * @param {Date|string} [date] - 参考日期
 * @returns {{start: string, end: string}}
 */
function getMonthRange(date) {
  var d = _toDate(date)
  var y = d.getFullYear()
  var m = d.getMonth()
  return { start: formatDate(new Date(y, m, 1)), end: formatDate(new Date(y, m + 1, 0)) }
}

/**
 * 判断是否为今天
 * @param {Date|string} date
 * @returns {boolean}
 */
function isToday(date) {
  var d = _toDate(date)
  var t = new Date()
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate()
}

/**
 * 判断是否已过期
 * @param {Date|string} date
 * @returns {boolean}
 */
function isExpired(date) {
  var d = _toDate(date)
  var t = new Date()
  t.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)
  return d < t
}

/**
 * 判断是否即将过期
 * @param {Date|string} date
 * @param {number} [days=3] - 天数阈值
 * @returns {boolean}
 */
function isExpiringSoon(date, days) {
  days = days || 3
  var d = _toDate(date)
  var t = new Date()
  t.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)
  var df = d.getTime() - t.getTime()
  return df >= 0 && df <= days * 86400000
}

/**
 * 计算距离指定日期的天数
 * @param {Date|string} date
 * @returns {number} 正数为未来，负数为过去
 */
function daysUntil(date) {
  var d = _toDate(date)
  var t = new Date()
  t.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)
  return Math.round((d.getTime() - t.getTime()) / 86400000)
}

/**
 * 计算两个日期之间的天数
 * @param {Date|string} a
 * @param {Date|string} b
 * @returns {number} 绝对值
 */
function daysBetween(a, b) {
  var d1 = _toDate(a)
  var d2 = _toDate(b)
  d1.setHours(0, 0, 0, 0)
  d2.setHours(0, 0, 0, 0)
  return Math.round(Math.abs(d2.getTime() - d1.getTime()) / 86400000)
}

/**
 * 获取相对时间描述
 * @param {Date|string} date
 * @returns {string} 如"今天"、"3天后"
 */
function getRelativeTime(date) {
  var d = daysUntil(date)
  if (d === 0) return '今天'
  if (d === 1) return '明天'
  if (d === -1) return '昨天'
  if (d > 1 && d <= 7) return d + '天后'
  if (d < -1 && d >= -7) return Math.abs(d) + '天前'
  if (d > 7) return formatDate(date, 'MM-DD')
  return '已过期' + Math.abs(d) + '天'
}

/**
 * 获取星期几
 * @param {Date|string} date
 * @returns {string} 如"周一"
 */
function getWeekday(date) {
  return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][_toDate(date).getDay()]
}

/**
 * 获取指定月的天数
 * @param {number} month - 月份(1-12)
 * @param {number} [year] - 年份
 * @returns {number}
 */
function getMonthDays(month, year) {
  return new Date(year || new Date().getFullYear(), month, 0).getDate()
}

/**
 * 日期加减天数
 * @param {Date|string} date
 * @param {number} days - 天数（负数为减）
 * @returns {Date}
 */
function addDays(date, days) {
  var d = _toDate(date)
  d.setDate(d.getDate() + days)
  return d
}

/**
 * 判断两个日期是否在同一周
 * @param {Date|string} a
 * @param {Date|string} b
 * @returns {boolean}
 */
function isSameWeek(a, b) {
  return getWeekRange(a).start === getWeekRange(b).start
}

/**
 * 获取当前时间段的问候语
 * @returns {string}
 */
function getGreeting() {
  var h = new Date().getHours()
  if (h < 6) return '夜深了，注意休息 🌙'
  if (h < 9) return '早上好，新的一天开始啦 ☀️'
  if (h < 12) return '上午好，今天也要加油 💪'
  if (h < 14) return '中午好，吃午饭了吗 🍜'
  if (h < 18) return '下午好，喝杯茶休息一下 🍵'
  if (h < 21) return '晚上好，辛苦了一天 🌆'
  return '夜晚好，早点休息哦 🌙'
}

/**
 * 安全转换为Date对象
 * @param {Date|string} date
 * @returns {Date}
 */
function _toDate(date) {
  if (date instanceof Date) return new Date(date.getTime())
  if (typeof date === 'string') return new Date(date.replace(/-/g, '/'))
  return new Date()
}

module.exports = {
  formatDate: formatDate,
  formatDateTime: formatDateTime,
  getWeekRange: getWeekRange,
  getMonthRange: getMonthRange,
  isToday: isToday,
  isExpired: isExpired,
  isExpiringSoon: isExpiringSoon,
  daysUntil: daysUntil,
  daysBetween: daysBetween,
  getRelativeTime: getRelativeTime,
  getWeekday: getWeekday,
  getMonthDays: getMonthDays,
  addDays: addDays,
  isSameWeek: isSameWeek,
  getGreeting: getGreeting
}
