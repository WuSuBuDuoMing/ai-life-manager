/**
 * Unit tests for utils/date-utils.js
 * Run: node tests/date-utils.test.js
 */
var mock = require('./wx-mock')
global.wx = mock.wx
global.getApp = mock.getApp

var dateUtils = require('../utils/date-utils')

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

console.log('\n=== date-utils.test.js ===\n')

// formatDate
console.log('formatDate:')
var d = new Date(2026, 5, 11, 14, 30, 45)
assert(dateUtils.formatDate(d) === '2026-06-11', 'default format YYYY-MM-DD')
assert(dateUtils.formatDate(d, 'YYYY/MM/DD') === '2026/06/11', 'custom format YYYY/MM/DD')
assert(dateUtils.formatDate(d, 'MM-DD HH:mm') === '06-11 14:30', 'format with time')
assert(dateUtils.formatDate('2026-06-11') === '2026-06-11', 'string input')

// formatDateTime
console.log('formatDateTime:')
assert(dateUtils.formatDateTime(d) === '2026-06-11 14:30', 'formats datetime')

// getWeekRange
console.log('getWeekRange:')
var weekRange = dateUtils.getWeekRange(new Date(2026, 5, 11))
assert(typeof weekRange.start === 'string', 'returns start string')
assert(typeof weekRange.end === 'string', 'returns end string')
assert(weekRange.start <= weekRange.end, 'start <= end')

// isToday
console.log('isToday:')
assert(dateUtils.isToday(new Date()) === true, 'today returns true')
assert(dateUtils.isToday('2020-01-01') === false, 'past date returns false')

// isExpired
console.log('isExpired:')
assert(dateUtils.isExpired('2020-01-01') === true, 'past date is expired')
assert(dateUtils.isExpired('2099-12-31') === false, 'future date not expired')

// isExpiringSoon
console.log('isExpiringSoon:')
var tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
assert(dateUtils.isExpiringSoon(tomorrow) === true, 'tomorrow expiring soon (default 3 days)')
assert(dateUtils.isExpiringSoon('2020-01-01') === false, 'past date not expiring soon')

// daysUntil
console.log('daysUntil:')
var future = new Date()
future.setDate(future.getDate() + 5)
assert(dateUtils.daysUntil(future) === 5, '5 days in future')
assert(typeof dateUtils.daysUntil(new Date()) === 'number', 'returns number')

// daysBetween
console.log('daysBetween:')
assert(dateUtils.daysBetween('2026-06-01', '2026-06-11') === 10, '10 days between')
assert(dateUtils.daysBetween('2026-06-11', '2026-06-01') === 10, 'absolute value')

// getRelativeTime
console.log('getRelativeTime:')
assert(dateUtils.getRelativeTime(new Date()) === '今天', 'today')
var tmrw = new Date()
tmrw.setDate(tmrw.getDate() + 1)
assert(dateUtils.getRelativeTime(tmrw) === '明天', 'tomorrow')

// getWeekday
console.log('getWeekday:')
assert(dateUtils.getWeekday(new Date(2026, 5, 11)) === '周四', 'Thursday')

// getMonthDays
console.log('getMonthDays:')
assert(dateUtils.getMonthDays(2, 2026) === 28, 'Feb 2026 has 28 days')
assert(dateUtils.getMonthDays(1, 2026) === 31, 'Jan has 31 days')

// addDays
console.log('addDays:')
var added = dateUtils.addDays(new Date(2026, 5, 11), 5)
assert(added.getDate() === 16, 'add 5 days')

// getGreeting
console.log('getGreeting:')
var greeting = dateUtils.getGreeting()
assert(typeof greeting === 'string', 'returns string')
assert(greeting.length > 0, 'non-empty')

// Summary
console.log('\n--- Results: ' + passed + ' passed, ' + failed + ' failed ---')
process.exit(failed > 0 ? 1 : 0)
