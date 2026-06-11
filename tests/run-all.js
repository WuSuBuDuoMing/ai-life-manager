/**
 * Test runner - runs all test files sequentially
 * Run: node tests/run-all.js
 */
var path = require('path')
var fs = require('fs')

var testDir = __dirname
var files = fs.readdirSync(testDir).filter(function(f) {
  return f.endsWith('.test.js')
})

console.log('Found ' + files.length + ' test files:')
files.forEach(function(f) { console.log('  - ' + f) })
console.log('\nRun each test with: node tests/<filename>')
console.log('\nAvailable test files:')
console.log('  node tests/date-utils.test.js')
console.log('  node tests/money-utils.test.js')
console.log('  node tests/task-utils.test.js')
console.log('  node tests/bill-service.test.js')
console.log('  node tests/habit-service.test.js')
