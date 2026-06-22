/**
 * @module services/subscription-service
 * @description 订阅管理数据服务
 * 提供订阅服务的管理功能，包括：
 * - 20+ 常见订阅服务的追踪管理
 * - 月度/年度费用自动计算
 * - 即将续费的订阅提醒（7天内）
 * - AI 省钱建议（月支出分析、年付建议、娱乐类分析）
 */
var mockUtils = require('../utils/mock-utils')

var SUBSCRIPTION_DATA = [
  { name: 'Apple Music', icon: '🎵', price: 11, billingCycle: 'monthly', category: '娱乐', color: '#FC3C44' },
  { name: 'iCloud+ 200GB', icon: '☁️', price: 21, billingCycle: 'monthly', category: '工具', color: '#007AFF' },
  { name: 'YouTube Premium', icon: '▶️', price: 25.9, billingCycle: 'monthly', category: '娱乐', color: '#FF0000' },
  { name: 'Notion', icon: '📝', price: 96, billingCycle: 'yearly', category: '效率', color: '#000000' },
  { name: 'Spotify', icon: '🎶', price: 15.9, billingCycle: 'monthly', category: '娱乐', color: '#1DB954' },
  { name: 'Netflix', icon: '📺', price: 35, billingCycle: 'monthly', category: '娱乐', color: '#E50914' },
  { name: 'WPS会员', icon: '📄', price: 89, billingCycle: 'yearly', category: '效率', color: '#D04423' },
  { name: '百度网盘', icon: '💾', price: 25, billingCycle: 'monthly', category: '工具', color: '#306CFF' },
  { name: '知乎盐选', icon: '💡', price: 19.9, billingCycle: 'monthly', category: '学习', color: '#0066FF' },
  { name: '爱奇艺VIP', icon: '🎬', price: 25, billingCycle: 'monthly', category: '娱乐', color: '#00BE06' },
  { name: 'B站大会员', icon: '📱', price: 25, billingCycle: 'monthly', category: '娱乐', color: '#FB7299' },
  { name: '印象笔记', icon: '🐘', price: 148, billingCycle: 'yearly', category: '效率', color: '#00B050' },
  { name: 'Grammarly', icon: '✍️', price: 95.4, billingCycle: 'yearly', category: '学习', color: '#15C39A' },
  { name: 'ChatGPT Plus', icon: '🤖', price: 140, billingCycle: 'monthly', category: '学习', color: '#10A37F' },
  { name: 'Apple Arcade', icon: '🎮', price: 6, billingCycle: 'monthly', category: '娱乐', color: '#007AFF' },
  { name: '1Password', icon: '🔐', price: 24, billingCycle: 'yearly', category: '工具', color: '#3B69F5' },
  { name: '坚果云', icon: '☁️', price: 199, billingCycle: 'yearly', category: '工具', color: '#5B9A4D' },
  { name: 'Keep会员', icon: '🏃', price: 19, billingCycle: 'monthly', category: '健康', color: '#2DB55D' },
  { name: '喜马拉雅', icon: '🎧', price: 25, billingCycle: 'monthly', category: '学习', color: '#F0483F' },
  { name: '腾讯视频VIP', icon: '📺', price: 30, billingCycle: 'monthly', category: '娱乐', color: '#FF6A00' }
]

function generateMockSubscriptions() {
  var now = new Date()
  return SUBSCRIPTION_DATA.map(function(item, index) {
    var daysAhead = mockUtils.randomInt(1, 60)
    var monthsAgo = mockUtils.randomInt(1, 12)
    var startDate = new Date(now)
    startDate.setMonth(now.getMonth() - monthsAgo)
    return {
      id: mockUtils.generateId(),
      name: item.name,
      icon: item.icon,
      price: item.price,
      billingCycle: item.billingCycle,
      nextBillingDate: mockUtils.formatDate(new Date(now.getTime() + daysAhead * 86400000)),
      category: item.category,
      color: item.color,
      startDate: mockUtils.formatDate(startDate),
      autoRenew: Math.random() > 0.2
    }
  })
}

/**
 * 获取所有订阅
 * @returns {Promise<Array>} 订阅列表
 */
function getSubscriptions() {
  var data = mockUtils.initData('subscriptions', generateMockSubscriptions)
  return mockUtils.mockAsync(data)
}

/**
 * 计算月度订阅总费用
 * @param {Array} subscriptions - 订阅列表
 * @returns {number}
 */
function calculateMonthlyTotal(subscriptions) {
  return subscriptions.reduce(function(sum, s) {
    if (s.billingCycle === 'monthly') return sum + s.price
    if (s.billingCycle === 'yearly') return sum + (s.price / 12)
    if (s.billingCycle === 'weekly') return sum + (s.price * 4.33)
    return sum + s.price
  }, 0)
}

/**
 * 计算年度订阅总费用
 * @param {Array} subscriptions - 订阅列表
 * @returns {number}
 */
function calculateYearlyTotal(subscriptions) {
  return subscriptions.reduce(function(sum, s) {
    if (s.billingCycle === 'monthly') return sum + (s.price * 12)
    if (s.billingCycle === 'yearly') return sum + s.price
    if (s.billingCycle === 'weekly') return sum + (s.price * 52)
    return sum + s.price * 12
  }, 0)
}

/**
 * 获取即将续费的订阅
 * @param {Array} subscriptions - 订阅列表
 * @returns {Promise<Array>} 7天内续费的订阅
 */
function getUpcomingRenewals(subscriptions) {
  var now = new Date()
  var sevenDaysLater = new Date(now.getTime() + 7 * 86400000)
  var result = subscriptions.filter(function(s) {
    if (!s.nextBillingDate) return false
    var billing = new Date(s.nextBillingDate)
    return billing >= now && billing <= sevenDaysLater
  }).sort(function(a, b) { return new Date(a.nextBillingDate) - new Date(b.nextBillingDate) })
  return mockUtils.mockAsync(result)
}

/**
 * 添加订阅
 * @param {Object} sub - 订阅信息
 * @returns {Promise<Array>} 更新后的列表
 */
function addSubscription(sub) {
  var subs = mockUtils.initData('subscriptions', generateMockSubscriptions)
  subs.push(Object.assign({ id: mockUtils.generateId(), startDate: mockUtils.today(), autoRenew: true }, sub))
  mockUtils.setToStorage('subscriptions', subs)
  return mockUtils.mockAsync(subs)
}

/**
 * 删除订阅
 * @param {string} subId - 订阅ID
 * @returns {Promise<Array>} 更新后的列表
 */
function deleteSubscription(subId) {
  var subs = mockUtils.initData('subscriptions', generateMockSubscriptions)
  subs = subs.filter(function(s) { return s.id !== subId })
  mockUtils.setToStorage('subscriptions', subs)
  return mockUtils.mockAsync(subs)
}

/**
 * 获取AI省钱建议
 * @param {Array} subscriptions - 订阅列表
 * @returns {Promise<Array>} 建议列表
 */
function getAISavingTips(subscriptions) {
  var total = calculateMonthlyTotal(subscriptions)
  var tips = []
  if (total > 100) {
    tips.push({ icon: '💡', title: '月支出偏高', detail: '当前月订阅支出 ¥' + total.toFixed(2) + '，建议审查是否都在使用。' })
  }
  if (subscriptions.filter(function(s) { return s.billingCycle === 'monthly' }).length > 0) {
    tips.push({ icon: '🔄', title: '考虑年付优惠', detail: '月付切换年付通常可节省 15%-20%。' })
  }
  var entTotal = subscriptions.filter(function(s) { return s.category === '娱乐' })
    .reduce(function(sum, s) { return sum + s.price }, 0)
  if (entTotal > 50) {
    tips.push({ icon: '🎬', title: '娱乐类订阅较多', detail: '娱乐类月支出 ¥' + entTotal.toFixed(2) + '，可考虑合并。' })
  }
  if (tips.length === 0) {
    tips.push({ icon: '✅', title: '订阅支出健康', detail: '您的订阅管理做得很好，继续保持！' })
  }
  return mockUtils.mockAsync(tips)
}

module.exports = {
  getSubscriptions: getSubscriptions,
  calculateMonthlyTotal: calculateMonthlyTotal,
  calculateYearlyTotal: calculateYearlyTotal,
  getUpcomingRenewals: getUpcomingRenewals,
  addSubscription: addSubscription,
  deleteSubscription: deleteSubscription,
  getAISavingTips: getAISavingTips
}
