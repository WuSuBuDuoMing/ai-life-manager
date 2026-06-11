/**
 * 金额工具模块
 * 提供金额格式化、预算计算、统计分析等功能
 */

/**
 * 格式化金额
 * @param {number} amount - 金额
 * @param {string} [symbol='¥'] - 货币符号
 * @returns {string} 格式化后的金额
 */
function formatMoney(amount, symbol) {
  symbol = symbol || '¥'
  return symbol + (amount || 0).toFixed(2)
}

/**
 * 计算百分比
 * @param {number} value - 当前值
 * @param {number} total - 总值
 * @returns {number} 百分比（0-100）
 */
function calculatePercentage(value, total) {
  return total ? Math.round(value / total * 100) : 0
}

/**
 * 计算预算使用率
 * @param {number} spent - 已花费
 * @param {number} budget - 预算
 * @returns {number} 使用率（0-100）
 */
function calculateBudgetUsage(spent, budget) {
  return budget ? Math.min(Math.round(spent / budget * 100), 100) : 0
}

/**
 * 获取预算状态
 * @param {number} usage - 使用率
 * @returns {{status: string, text: string, color: string}}
 */
function getBudgetStatus(usage) {
  if (usage >= 100) return { status: 'danger', text: '已超支', color: '#EF5350' }
  if (usage >= 80) return { status: 'warning', text: '即将超支', color: '#FFA726' }
  return { status: 'good', text: '预算充足', color: '#66BB6A' }
}

/**
 * 按分类求和
 * @param {Array} records - 记录列表
 * @param {string} [field='category'] - 分类字段名
 * @returns {Array<{category: string, amount: number}>}
 */
function sumByCategory(records, field) {
  var map = {}
  records.forEach(function(r) {
    var c = r[field || 'category'] || '其他'
    map[c] = (map[c] || 0) + (r.amount || 0)
  })
  return Object.keys(map).map(function(k) { return { category: k, amount: map[k] } })
}

/**
 * 获取月度总额
 * @param {Array} records - 记录列表
 * @param {number} month - 月份(1-12)
 * @returns {number}
 */
function getMonthTotal(records, month) {
  var t = 0
  records.forEach(function(r) {
    if (new Date(r.date).getMonth() + 1 === month) t += r.amount || 0
  })
  return t
}

/**
 * 获取年度总额
 * @param {Array} records - 记录列表
 * @param {number} year - 年份
 * @returns {number}
 */
function getYearTotal(records, year) {
  var t = 0
  records.forEach(function(r) {
    if (new Date(r.date).getFullYear() === year) t += r.amount || 0
  })
  return t
}

/**
 * 计算日均金额
 * @param {Array} records - 记录列表
 * @param {number} [days=30] - 天数
 * @returns {number}
 */
function getAverageDaily(records, days) {
  var t = 0
  records.forEach(function(r) { t += r.amount || 0 })
  return Math.round(t / (days || 30) * 100) / 100
}

/**
 * 格式化账单摘要
 * @param {Array} records - 收支记录
 * @returns {{income: number, expense: number, balance: number}}
 */
function formatBillSummary(records) {
  var inc = 0, exp = 0
  records.forEach(function(r) {
    if (r.type === 'income') inc += r.amount
    else exp += r.amount
  })
  return { income: inc, expense: exp, balance: inc - exp }
}

module.exports = {
  formatMoney: formatMoney,
  calculatePercentage: calculatePercentage,
  calculateBudgetUsage: calculateBudgetUsage,
  getBudgetStatus: getBudgetStatus,
  sumByCategory: sumByCategory,
  getMonthTotal: getMonthTotal,
  getYearTotal: getYearTotal,
  getAverageDaily: getAverageDaily,
  formatBillSummary: formatBillSummary
}
