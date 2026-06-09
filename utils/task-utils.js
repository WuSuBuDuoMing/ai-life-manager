// 任务工具模块
function generateId(prefix) {
  prefix = prefix || 'item'
  return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6)
}
function sortByDate(items, field, asc) {
  field = field || 'dueDate'; asc = asc !== false
  return items.slice().sort(function(a, b) {
    var da = new Date(a[field] || 0).getTime(), db = new Date(b[field] || 0).getTime()
    return asc ? da - db : db - da
  })
}
function sortByPriority(items) {
  var order = { urgent: 0, high: 1, normal: 2, low: 3 }
  return items.slice().sort(function(a, b) { return (order[a.priority] || 2) - (order[b.priority] || 2) })
}
function filterByStatus(items, status) {
  if (!status || status === 'all') return items
  return items.filter(function(i) { return i.status === status })
}
function filterByDateRange(items, start, end, field) {
  field = field || 'dueDate'
  var s = new Date(start).getTime(), e = new Date(end).getTime()
  return items.filter(function(i) {
    var t = new Date(i[field]).getTime()
    return t >= s && t <= e
  })
}
function getCompletionRate(completed, total) {
  return total ? Math.round(completed / total * 100) : 0
}
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
function getOverdueItems(items) {
  var today = new Date(); today.setHours(0, 0, 0, 0)
  return items.filter(function(i) {
    if (!i.dueDate || i.status === 'completed') return false
    return new Date(i.dueDate) < today
  })
}
function getUpcomingItems(items, days) {
  days = days || 7
  var now = new Date(), end = new Date(now.getTime() + days * 86400000)
  return items.filter(function(i) {
    if (!i.dueDate || i.status === 'completed') return false
    var d = new Date(i.dueDate)
    return d >= now && d <= end
  })
}
module.exports = {
  generateId: generateId, sortByDate: sortByDate, sortByPriority: sortByPriority,
  filterByStatus: filterByStatus, filterByDateRange: filterByDateRange,
  getCompletionRate: getCompletionRate, groupByDate: groupByDate,
  groupByCategory: groupByCategory, getOverdueItems: getOverdueItems,
  getUpcomingItems: getUpcomingItems
}
