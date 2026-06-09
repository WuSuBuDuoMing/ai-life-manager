// 金额工具
function formatMoney(amount, symbol) {
  symbol = symbol || '¥'
  return symbol + (amount || 0).toFixed(2)
}
function calculatePercentage(value, total) {
  return total ? Math.round(value / total * 100) : 0
}
function calculateBudgetUsage(spent, budget) {
  return budget ? Math.min(Math.round(spent / budget * 100), 100) : 0
}
function getBudgetStatus(usage) {
  if (usage >= 100) return { status: 'danger', text: '已超支', color: '#EF5350' }
  if (usage >= 80) return { status: 'warning', text: '即将超支', color: '#FFA726' }
  return { status: 'good', text: '预算充足', color: '#66BB6A' }
}
function sumByCategory(records, field) {
  var map = {}
  records.forEach(function(r) { var c = r[field] || '其他'; map[c] = (map[c] || 0) + (r.amount || 0) })
  return Object.keys(map).map(function(k) { return { category: k, amount: map[k] } })
}
function getMonthTotal(records, month) {
  var t = 0
  records.forEach(function(r) { if (new Date(r.date).getMonth() + 1 === month) t += r.amount || 0 })
  return t
}
function getYearTotal(records, year) {
  var t = 0
  records.forEach(function(r) { if (new Date(r.date).getFullYear() === year) t += r.amount || 0 })
  return t
}
function getAverageDaily(records, days) {
  var t = 0; records.forEach(function(r) { t += r.amount || 0 })
  return Math.round(t / (days || 30) * 100) / 100
}
function formatBillSummary(records) {
  var inc = 0, exp = 0
  records.forEach(function(r) { if (r.type === 'income') inc += r.amount; else exp += r.amount })
  return { income: inc, expense: exp, balance: inc - exp }
}
module.exports = { formatMoney: formatMoney, calculatePercentage: calculatePercentage, calculateBudgetUsage: calculateBudgetUsage, getBudgetStatus: getBudgetStatus, sumByCategory: sumByCategory, getMonthTotal: getMonthTotal, getYearTotal: getYearTotal, getAverageDaily: getAverageDaily, formatBillSummary: formatBillSummary }
