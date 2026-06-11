/**
 * 任务工具模块
 * 提供任务排序、筛选、分组、ID生成等功能
 */

/**
 * 生成唯一ID
 * @param {string} [prefix='item'] - ID前缀
 * @returns {string}
 */
function generateId(prefix) {
  prefix = prefix || 'item'
  return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6)
}

/**
 * 按日期排序
 * @param {Array} items - 任务列表
 * @param {string} [field='dueDate'] - 日期字段名
 * @param {boolean} [asc=true] - 是否升序
 * @returns {Array} 排序后的新数组
 */
function sortByDate(items, field, asc) {
  field = field || 'dueDate'
  asc = asc !== false
  return items.slice().sort(function(a, b) {
    var da = new Date(a[field] || 0).getTime()
    var db = new Date(b[field] || 0).getTime()
    return asc ? da - db : db - da
  })
}

/**
 * 按优先级排序
 * @param {Array} items - 任务列表
 * @returns {Array} 排序后的新数组
 */
function sortByPriority(items) {
  var order = { urgent: 0, high: 1, normal: 2, low: 3 }
  return items.slice().sort(function(a, b) {
    return (order[a.priority] || 2) - (order[b.priority] || 2)
  })
}

/**
 * 按状态筛选
 * @param {Array} items - 任务列表
 * @param {string} status - 状态值，'all'返回全部
 * @returns {Array}
 */
function filterByStatus(items, status) {
  if (!status || status === 'all') return items
  return items.filter(function(i) { return i.status === status })
}

/**
 * 按日期范围筛选
 * @param {Array} items - 任务列表
 * @param {string} start - 开始日期
 * @param {string} end - 结束日期
 * @param {string} [field='dueDate'] - 日期字段名
 * @returns {Array}
 */
function filterByDateRange(items, start, end, field) {
  field = field || 'dueDate'
  var s = new Date(start).getTime()
  var e = new Date(end).getTime()
  return items.filter(function(i) {
    var t = new Date(i[field]).getTime()
    return t >= s && t <= e
  })
}

/**
 * 计算完成率
 * @param {number} completed - 已完成数
 * @param {number} total - 总数
 * @returns {number} 百分比（0-100）
 */
function getCompletionRate(completed, total) {
  return total ? Math.round(completed / total * 100) : 0
}

/**
 * 按日期分组
 * @param {Array} items - 任务列表
 * @param {string} [field='date'] - 日期字段名
 * @returns {Array<{date: string, items: Array}>}
 */
function groupByDate(items, field) {
  field = field || 'date'
  var map = {}
  items.forEach(function(i) {
    var key = (i[field] || '未知').substring(0, 10)
    if (!map[key]) map[key] = []
    map[key].push(i)
  })
  return Object.keys(map).map(function(k) { return { date: k, items: map[k] } })
}

/**
 * 按分类分组
 * @param {Array} items - 任务列表
 * @param {string} [field='category'] - 分类字段名
 * @returns {Array<{category: string, items: Array}>}
 */
function groupByCategory(items, field) {
  field = field || 'category'
  var map = {}
  items.forEach(function(i) {
    var key = i[field] || '其他'
    if (!map[key]) map[key] = []
    map[key].push(i)
  })
  return Object.keys(map).map(function(k) { return { category: k, items: map[k] } })
}

/**
 * 获取已过期的任务
 * @param {Array} items - 任务列表
 * @returns {Array}
 */
function getOverdueItems(items) {
  var today = new Date()
  today.setHours(0, 0, 0, 0)
  return items.filter(function(i) {
    if (!i.dueDate || i.status === 'completed') return false
    return new Date(i.dueDate) < today
  })
}

/**
 * 获取即将到期的任务
 * @param {Array} items - 任务列表
 * @param {number} [days=7] - 天数范围
 * @returns {Array}
 */
function getUpcomingItems(items, days) {
  days = days || 7
  var now = new Date()
  var end = new Date(now.getTime() + days * 86400000)
  return items.filter(function(i) {
    if (!i.dueDate || i.status === 'completed') return false
    var d = new Date(i.dueDate)
    return d >= now && d <= end
  })
}

module.exports = {
  generateId: generateId,
  sortByDate: sortByDate,
  sortByPriority: sortByPriority,
  filterByStatus: filterByStatus,
  filterByDateRange: filterByDateRange,
  getCompletionRate: getCompletionRate,
  groupByDate: groupByDate,
  groupByCategory: groupByCategory,
  getOverdueItems: getOverdueItems,
  getUpcomingItems: getUpcomingItems
}
