/**
 * Unit tests for utils/money-utils.js
 * Run: node tests/money-utils.test.js
 */
var mock = require('./wx-mock')
global.wx = mock.wx
global.getApp = mock.getApp

var moneyUtils = require('../utils/money-utils')

var passed = 0
var failed = 0

function assert(condition, message) {
  if (condition) {
    passed++
    console.log('  PASS: ' + message)
  } else {
    failed++
    console.log('  FAIL: ' + message)
  }
}

console.log('\n=== money-utils.test.js ===\n')

// formatMoney
console.log('formatMoney:')
assert(moneyUtils.formatMoney(100) === '¥100.00', 'formats with default symbol')
assert(moneyUtils.formatMoney(99.5, '$') === '$99.50', 'formats with custom symbol')
assert(moneyUtils.formatMoney(0) === '¥0.00', 'formats zero')
assert(moneyUtils.formatMoney(null) === '¥0.00', 'handles null')

// calculatePercentage
console.log('calculatePercentage:')
assert(moneyUtils.calculatePercentage(50, 100) === 50, '50% of 100')
assert(moneyUtils.calculatePercentage(1, 3) === 33, 'rounds to 33%')
assert(moneyUtils.calculatePercentage(0, 0) === 0, 'handles zero total')

// calculateBudgetUsage
console.log('calculateBudgetUsage:')
assert(moneyUtils.calculateBudgetUsage(500, 1000) === 50, '50% usage')
assert(moneyUtils.calculateBudgetUsage(1500, 1000) === 100, 'caps at 100%')
assert(moneyUtils.calculateBudgetUsage(0, 0) === 0, 'handles zero budget')

// getBudgetStatus
console.log('getBudgetStatus:')
assert(moneyUtils.getBudgetStatus(50).status === 'good', 'good status at 50%')
assert(moneyUtils.getBudgetStatus(85).status === 'warning', 'warning at 85%')
assert(moneyUtils.getBudgetStatus(100).status === 'danger', 'danger at 100%')

// sumByCategory
console.log('sumByCategory:')
var records = [
  { category: '食品', amount: 100 },
  { category: '食品', amount: 50 },
  { category: '交通', amount: 30 }
]
var result = moneyUtils.sumByCategory(records)
assert(result.length === 2, 'two categories')
var food = result.find(function(r) { return r.category === '食品' })
assert(food && food.amount === 150, 'food sum is 150')

// getMonthTotal
console.log('getMonthTotal:')
var monthRecords = [
  { date: '2026-06-01', amount: 100 },
  { date: '2026-06-15', amount: 200 },
  { date: '2026-05-01', amount: 50 }
]
assert(moneyUtils.getMonthTotal(monthRecords, 6) === 300, 'June total is 300')
assert(moneyUtils.getMonthTotal(monthRecords, 5) === 50, 'May total is 50')

// formatBillSummary
console.log('formatBillSummary:')
var bills = [
  { type: 'income', amount: 5000 },
  { type: 'expense', amount: 2000 },
  { type: 'expense', amount: 1000 }
]
var summary = moneyUtils.formatBillSummary(bills)
assert(summary.income === 5000, 'income is 5000')
assert(summary.expense === 3000, 'expense is 3000')
assert(summary.balance === 2000, 'balance is 2000')

// Summary
console.log('\n--- Results: ' + passed + ' passed, ' + failed + ' failed ---')
process.exit(failed > 0 ? 1 : 0)
