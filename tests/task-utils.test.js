/**
 * Unit tests for utils/task-utils.js
 * Run: node tests/task-utils.test.js
 */
var mock = require('./wx-mock')
global.wx = mock.wx
global.getApp = mock.getApp

var taskUtils = require('../utils/task-utils')

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

console.log('\n=== task-utils.test.js ===\n')

// generateId
console.log('generateId:')
var id1 = taskUtils.generateId()
var id2 = taskUtils.generateId()
assert(typeof id1 === 'string', 'returns string')
assert(id1 !== id2, 'generates unique ids')
assert(id1.indexOf('item_') === 0, 'default prefix')
var customId = taskUtils.generateId('test')
assert(customId.indexOf('test_') === 0, 'custom prefix')

// sortByDate
console.log('sortByDate:')
var items = [
  { id: 1, dueDate: '2026-06-15' },
  { id: 2, dueDate: '2026-06-10' },
  { id: 3, dueDate: '2026-06-20' }
]
var sorted = taskUtils.sortByDate(items)
assert(sorted[0].id === 2, 'ascending: earliest first')
assert(sorted[2].id === 3, 'ascending: latest last')
var desc = taskUtils.sortByDate(items, 'dueDate', false)
assert(desc[0].id === 3, 'descending: latest first')

// sortByPriority
console.log('sortByPriority:')
var priorityItems = [
  { id: 1, priority: 'low' },
  { id: 2, priority: 'urgent' },
  { id: 3, priority: 'normal' }
]
var psorted = taskUtils.sortByPriority(priorityItems)
assert(psorted[0].priority === 'urgent', 'urgent first')
assert(psorted[2].priority === 'low', 'low last')

// filterByStatus
console.log('filterByStatus:')
var statusItems = [
  { id: 1, status: 'completed' },
  { id: 2, status: 'pending' },
  { id: 3, status: 'completed' }
]
assert(taskUtils.filterByStatus(statusItems, 'completed').length === 2, 'filter completed')
assert(taskUtils.filterByStatus(statusItems, 'all').length === 3, 'all returns all')
assert(taskUtils.filterByStatus(statusItems, null).length === 3, 'null returns all')

// getCompletionRate
console.log('getCompletionRate:')
assert(taskUtils.getCompletionRate(3, 10) === 30, '30% rate')
assert(taskUtils.getCompletionRate(0, 0) === 0, 'handles zero total')

// groupByDate
console.log('groupByDate:')
var dateItems = [
  { id: 1, date: '2026-06-10' },
  { id: 2, date: '2026-06-10' },
  { id: 3, date: '2026-06-11' }
]
var groups = taskUtils.groupByDate(dateItems)
assert(groups.length === 2, 'two date groups')
var g10 = groups.find(function(g) { return g.date === '2026-06-10' })
assert(g10 && g10.items.length === 2, 'June 10 has 2 items')

// groupByCategory
console.log('groupByCategory:')
var catItems = [
  { id: 1, category: '食品' },
  { id: 2, category: '食品' },
  { id: 3, category: '日用' }
]
var catGroups = taskUtils.groupByCategory(catItems)
assert(catGroups.length === 2, 'two category groups')

// getOverdueItems
console.log('getOverdueItems:')
var overdueItems = [
  { id: 1, dueDate: '2020-01-01', status: 'pending' },
  { id: 2, dueDate: '2099-12-31', status: 'pending' },
  { id: 3, dueDate: '2020-01-01', status: 'completed' }
]
var overdue = taskUtils.getOverdueItems(overdueItems)
assert(overdue.length === 1, 'only overdue pending')
assert(overdue[0].id === 1, 'correct item')

// getUpcomingItems
console.log('getUpcomingItems:')
var today = new Date()
var in3 = new Date(today)
in3.setDate(in3.getDate() + 3)
var in10 = new Date(today)
in10.setDate(in10.getDate() + 10)
var upcomingItems = [
  { id: 1, dueDate: in3.toISOString().split('T')[0], status: 'pending' },
  { id: 2, dueDate: in10.toISOString().split('T')[0], status: 'pending' },
  { id: 3, dueDate: in3.toISOString().split('T')[0], status: 'completed' }
]
var upcoming = taskUtils.getUpcomingItems(upcomingItems, 7)
assert(upcoming.length === 1, 'only pending within 7 days')

// Summary
console.log('\n--- Results: ' + passed + ' passed, ' + failed + ' failed ---')
process.exit(failed > 0 ? 1 : 0)
