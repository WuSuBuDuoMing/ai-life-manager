/**
 * wx API mock for testing
 * Simulates WeChat Mini Program storage and UI APIs
 */
var storage = {}

var wx = {
  getStorageSync: function(key) {
    return storage[key] !== undefined ? storage[key] : ''
  },
  setStorageSync: function(key, value) {
    storage[key] = value
  },
  removeStorageSync: function(key) {
    delete storage[key]
  },
  clearStorageSync: function() {
    storage = {}
  },
  getStorageInfoSync: function() {
    var keys = Object.keys(storage)
    return {
      keys: keys,
      currentSize: keys.length,
      limitSize: 10240
    }
  },
  showToast: function() {},
  showModal: function() {},
  showActionSheet: function() {},
  setClipboardData: function() {},
  navigateTo: function() {},
  redirectTo: function() {},
  switchTab: function() {}
}

function getApp() {
  return {
    globalData: {
      theme: 'light',
      userInfo: { nickname: '生活家', avatar: '' },
      familyMembers: ['我', '室友A', '室友B'],
      budget: { monthly: 3000, currency: '¥' },
      version: '1.2.0'
    }
  }
}

function resetStorage() {
  storage = {}
}

module.exports = { wx: wx, getApp: getApp, resetStorage: resetStorage }
