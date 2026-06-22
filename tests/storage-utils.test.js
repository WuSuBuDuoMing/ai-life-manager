/**
 * @module tests/storage-utils.test
 * @description storage-utils 模块单元测试
 */

// Setup wx mock before requiring the module
var mock = require('./wx-mock')
global.wx = mock.wx
global.getApp = mock.getApp

var storageUtils = require('../utils/storage-utils')
var assert = require('assert')

var passed = 0
var failed = 0

function test(name, fn) {
  try {
    fn()
    passed++
    console.log('  PASS: ' + name)
  } catch (e) {
    failed++
    console.log('  FAIL: ' + name)
    console.log('    ' + e.message)
  }
}

function assertEqual(actual, expected, msg) {
  var a = JSON.stringify(actual)
  var e = JSON.stringify(expected)
  if (a !== e) {
    throw new Error((msg || 'Assertion') + ' — expected ' + e + ', got ' + a)
  }
}

// Reset storage before each group
mock.resetStorage()

console.log('storage-utils.test.js')
console.log('')

// ===== get / set / has / remove =====
console.log('--- get / set / has / remove ---')

test('set and get a string value', function() {
  storageUtils.set('test_key', 'hello')
  assertEqual(storageUtils.get('test_key'), 'hello')
})

test('get returns default when key missing', function() {
  assertEqual(storageUtils.get('nonexistent_key', 'fallback'), 'fallback')
})

test('get returns null when key missing and no default', function() {
  assertEqual(storageUtils.get('nonexistent_key'), null)
})

test('set returns true on success', function() {
  assertEqual(storageUtils.set('set_ok', 42), true)
})

test('has returns true for existing key', function() {
  storageUtils.set('exists_key', 'yes')
  assertEqual(storageUtils.has('exists_key'), true)
})

test('has returns false for missing key', function() {
  assertEqual(storageUtils.has('missing_has_key'), false)
})

test('remove deletes a key', function() {
  storageUtils.set('remove_me', 'gone')
  storageUtils.remove('remove_me')
  assertEqual(storageUtils.has('remove_me'), false)
})

test('clear removes all keys', function() {
  storageUtils.set('a', 1)
  storageUtils.set('b', 2)
  storageUtils.clear()
  assertEqual(storageUtils.has('a'), false)
  assertEqual(storageUtils.has('b'), false)
})

// ===== getObject / setObject =====
console.log('')
console.log('--- getObject / setObject ---')

test('setObject and getObject work', function() {
  storageUtils.setObject('obj_key', { x: 1, y: 2 })
  var result = storageUtils.getObject('obj_key')
  assertEqual(result.x, 1)
  assertEqual(result.y, 2)
})

test('getObject merges with default', function() {
  storageUtils.setObject('merge_key', { a: 1 })
  storageUtils.setObject('merge_key', { b: 2 })
  var result = storageUtils.getObject('merge_key')
  assertEqual(result.a, 1)
  assertEqual(result.b, 2)
})

test('getObject returns default for non-object', function() {
  storageUtils.set('str_key', 'not_an_object')
  var result = storageUtils.getObject('str_key', { fallback: true })
  assertEqual(result.fallback, true)
})

// ===== getList / addToList / removeFromList / updateListItem =====
console.log('')
console.log('--- list operations ---')

test('getList returns array', function() {
  storageUtils.set('list_key', [1, 2, 3])
  var list = storageUtils.getList('list_key')
  assertEqual(list.length, 3)
})

test('getList returns empty array for missing key', function() {
  var list = storageUtils.getList('empty_list_key')
  assertEqual(list.length, 0)
})

test('addToList appends item', function() {
  storageUtils.set('add_list', [])
  storageUtils.addToList('add_list', { id: '1', val: 'a' })
  storageUtils.addToList('add_list', { id: '2', val: 'b' })
  var list = storageUtils.getList('add_list')
  assertEqual(list.length, 2)
  assertEqual(list[1].val, 'b')
})

test('removeFromList removes by id', function() {
  storageUtils.set('rm_list', [
    { id: '10', name: 'first' },
    { id: '20', name: 'second' }
  ])
  storageUtils.removeFromList('rm_list', '10')
  var list = storageUtils.getList('rm_list')
  assertEqual(list.length, 1)
  assertEqual(list[0].id, '20')
})

test('updateListItem updates by id', function() {
  storageUtils.set('upd_list', [
    { id: 'x', status: 'old' }
  ])
  storageUtils.updateListItem('upd_list', 'x', { status: 'new' })
  var list = storageUtils.getList('upd_list')
  assertEqual(list[0].status, 'new')
})

// ===== getStorageInfo / getSize / getAllKeys =====
console.log('')
console.log('--- storage info ---')

test('getStorageInfo returns valid shape', function() {
  mock.resetStorage()
  storageUtils.set('info_test', 'data')
  var info = storageUtils.getStorageInfo()
  assertEqual(typeof info.used, 'number')
  assertEqual(typeof info.limit, 'number')
  assertEqual(typeof info.percentage, 'number')
})

test('getSize returns a number', function() {
  var size = storageUtils.getSize()
  assertEqual(typeof size, 'number')
})

test('getAllKeys returns array of strings', function() {
  mock.resetStorage()
  storageUtils.set('k1', 1)
  storageUtils.set('k2', 2)
  var keys = storageUtils.getAllKeys()
  assertEqual(Array.isArray(keys), true)
  assert(keys.length >= 2)
})

// ===== clearByPrefix =====
console.log('')
console.log('--- clearByPrefix ---')

test('clearByPrefix removes matching keys', function() {
  mock.resetStorage()
  storageUtils.set('pre_a', 1)
  storageUtils.set('pre_b', 2)
  storageUtils.set('other_c', 3)
  storageUtils.clearByPrefix('pre_')
  assertEqual(storageUtils.has('pre_a'), false)
  assertEqual(storageUtils.has('pre_b'), false)
  assertEqual(storageUtils.has('other_c'), true)
})

// ===== setBatch / getBatch =====
console.log('')
console.log('--- setBatch / getBatch ---')

test('setBatch and getBatch work together', function() {
  mock.resetStorage()
  storageUtils.setBatch({ batch_x: 100, batch_y: 200 })
  var result = storageUtils.getBatch(['batch_x', 'batch_y'])
  assertEqual(result.batch_x, 100)
  assertEqual(result.batch_y, 200)
})

// ===== Results =====
console.log('')
console.log('--- Results: ' + passed + ' passed, ' + failed + ' failed ---')

if (failed > 0) process.exit(1)
