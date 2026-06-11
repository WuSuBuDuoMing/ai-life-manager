/**
 * Unit tests for services/bill-service.js
 * Run: node tests/bill-service.test.js
 */
var mock = require('./wx-mock')
global.wx = mock.wx
global.getApp = mock.getApp

var billService = require('../services/bill-service')

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

function reset() {
  mock.resetStorage()
}

console.log('\n=== bill-service.test.js ===\n')

// getBills returns mock data
console.log('getBills:')
reset()
billService.getBills().then(function(bills) {
  assert(Array.isArray(bills), 'returns array')
  assert(bills.length === 15, 'has 15 mock bills')
  assert(bills[0].id === 'bill_01', 'first bill id')
  assert(bills[0].name === '房租', 'first bill name')
  assert(typeof bills[0].amount === 'number', 'amount is number')

  // addBill
  console.log('addBill:')
  return billService.addBill({ name: '测试账单', amount: 100, dueDate: '2026-06-25' })
}).then(function(newBill) {
  assert(newBill.name === '测试账单', 'new bill name')
  assert(newBill.amount === 100, 'new bill amount')
  assert(newBill.paid === false, 'new bill unpaid')
  assert(typeof newBill.id === 'string', 'new bill has id')

  // markPaid
  console.log('markPaid:')
  return billService.markPaid('bill_02')
}).then(function(result) {
  assert(result.paid === true, 'bill marked as paid')

  // markPaid nonexistent
  console.log('markPaid (nonexistent):')
  return billService.markPaid('nonexistent')
}).then(function(result) {
  assert(result.success === false, 'returns failure')
  assert(result.message === '账单不存在', 'correct error message')

  // getMonthlyTotal
  console.log('getMonthlyTotal:')
  return billService.getMonthlyTotal()
}).then(function(total) {
  assert(typeof total.total === 'number', 'has total')
  assert(typeof total.paid === 'number', 'has paid')
  assert(typeof total.unpaid === 'number', 'has unpaid')

  // getUnpaidBills
  console.log('getUnpaidBills:')
  return billService.getUnpaidBills()
}).then(function(unpaid) {
  assert(Array.isArray(unpaid), 'returns array')
  var allUnpaid = unpaid.every(function(b) { return !b.paid })
  assert(allUnpaid, 'all bills are unpaid')

  // getUpcoming
  console.log('getUpcoming:')
  return billService.getUpcoming(60)
}).then(function(upcoming) {
  assert(Array.isArray(upcoming), 'returns array')

  // deleteBill
  console.log('deleteBill:')
  return billService.deleteBill('bill_15')
}).then(function(result) {
  assert(result.success === true, 'delete succeeds')

  // Summary
  console.log('\n--- Results: ' + passed + ' passed, ' + failed + ' failed ---')
  process.exit(failed > 0 ? 1 : 0)
}).catch(function(err) {
  console.error('Test error:', err)
  process.exit(1)
})
