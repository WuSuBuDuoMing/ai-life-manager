/**
 * 账单提醒服务
 * 提供账单管理、到期提醒、付款追踪等功能
 */

var mockUtils = require('../utils/mock-utils');

var STORAGE_KEY = 'bills';

function generateMockBills() {
  return [
    { id: 'bill_01', name: '房租', amount: 2500, dueDate: '2026-06-28', category: '住房', paid: false, recurring: true, frequency: '每月', icon: '🏠' },
    { id: 'bill_02', name: '电费', amount: 180, dueDate: '2026-06-15', category: '水电', paid: false, recurring: true, frequency: '每月', icon: '💡' },
    { id: 'bill_03', name: '水费', amount: 45, dueDate: '2026-06-15', category: '水电', paid: false, recurring: true, frequency: '每月', icon: '🚰' },
    { id: 'bill_04', name: '手机话费', amount: 89, dueDate: '2026-06-10', category: '通讯', paid: false, recurring: true, frequency: '每月', icon: '📱' },
    { id: 'bill_05', name: '宽带', amount: 120, dueDate: '2026-06-20', category: '通讯', paid: false, recurring: true, frequency: '每月', icon: '🌐' },
    { id: 'bill_06', name: '健身房', amount: 299, dueDate: '2026-06-12', category: '订阅', paid: true, recurring: true, frequency: '每月', icon: '💪' },
    { id: 'bill_07', name: 'Netflix', amount: 45, dueDate: '2026-06-18', category: '订阅', paid: false, recurring: true, frequency: '每月', icon: '🎬' },
    { id: 'bill_08', name: 'Spotify', amount: 15, dueDate: '2026-06-22', category: '订阅', paid: false, recurring: true, frequency: '每月', icon: '🎵' },
    { id: 'bill_09', name: 'iCloud', amount: 21, dueDate: '2026-06-25', category: '订阅', paid: false, recurring: true, frequency: '每月', icon: '☁️' },
    { id: 'bill_10', name: '车贷', amount: 3200, dueDate: '2026-06-15', category: '贷款', paid: false, recurring: true, frequency: '每月', icon: '🚗' },
    { id: 'bill_11', name: '信用卡（招行）', amount: 4500, dueDate: '2026-06-10', category: '贷款', paid: false, recurring: true, frequency: '每月', icon: '💳' },
    { id: 'bill_12', name: '物业费', amount: 380, dueDate: '2026-06-30', category: '住房', paid: false, recurring: true, frequency: '每月', icon: '🏢' },
    { id: 'bill_13', name: '燃气费', amount: 65, dueDate: '2026-06-20', category: '水电', paid: false, recurring: true, frequency: '每月', icon: '🔥' },
    { id: 'bill_14', name: '车险', amount: 4200, dueDate: '2026-07-01', category: '保险', paid: false, recurring: true, frequency: '每年', icon: '🛡️' },
    { id: 'bill_15', name: '信用卡（工行）', amount: 1800, dueDate: '2026-06-14', category: '贷款', paid: false, recurring: true, frequency: '每月', icon: '💳' }
  ];
}

function getBills() {
  var bills = mockUtils.initData(STORAGE_KEY, generateMockBills);
  return mockUtils.mockAsync(bills);
}

function addBill(bill) {
  var bills = mockUtils.getFromStorage(STORAGE_KEY, []);
  var newBill = Object.assign({
    id: mockUtils.generateId(),
    paid: false,
    recurring: false,
    frequency: '一次性',
    icon: '📋'
  }, bill);
  bills.push(newBill);
  mockUtils.setToStorage(STORAGE_KEY, bills);
  return mockUtils.mockAsync(newBill);
}

function updateBill(id, updates) {
  var bills = mockUtils.getFromStorage(STORAGE_KEY, []);
  var bill = mockUtils.findById(bills, id);
  if (!bill) {
    return mockUtils.mockAsync({ success: false, message: '账单不存在' });
  }
  Object.assign(bill, updates);
  mockUtils.setToStorage(STORAGE_KEY, bills);
  return mockUtils.mockAsync(bill);
}

function markPaid(id) {
  var bills = mockUtils.getFromStorage(STORAGE_KEY, []);
  var bill = mockUtils.findById(bills, id);
  if (!bill) {
    return mockUtils.mockAsync({ success: false, message: '账单不存在' });
  }
  bill.paid = true;
  mockUtils.setToStorage(STORAGE_KEY, bills);
  return mockUtils.mockAsync(bill);
}

function deleteBill(id) {
  var bills = mockUtils.getFromStorage(STORAGE_KEY, []);
  var index = mockUtils.findIndexById(bills, id);
  if (index === -1) {
    return mockUtils.mockAsync({ success: false, message: '账单不存在' });
  }
  bills.splice(index, 1);
  mockUtils.setToStorage(STORAGE_KEY, bills);
  return mockUtils.mockAsync({ success: true });
}

function getUpcoming(days) {
  var daysNum = days || 7;
  var bills = mockUtils.getFromStorage(STORAGE_KEY, []);
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var endDate = new Date(today);
  endDate.setDate(endDate.getDate() + daysNum);
  var upcoming = bills.filter(function (b) {
    if (b.paid) return false;
    var due = new Date(b.dueDate);
    return due >= today && due <= endDate;
  });
  upcoming.sort(function (a, b) {
    return new Date(a.dueDate) - new Date(b.dueDate);
  });
  return mockUtils.mockAsync(upcoming);
}

function getMonthlyTotal() {
  var bills = mockUtils.getFromStorage(STORAGE_KEY, []);
  var now = new Date();
  var monthStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  var monthlyBills = bills.filter(function (b) {
    return b.dueDate.indexOf(monthStr) === 0;
  });
  var total = monthlyBills.reduce(function (sum, b) {
    return sum + b.amount;
  }, 0);
  var paidTotal = monthlyBills.filter(function (b) { return b.paid; }).reduce(function (sum, b) {
    return sum + b.amount;
  }, 0);
  return mockUtils.mockAsync({
    month: monthStr,
    total: total,
    paid: paidTotal,
    unpaid: total - paidTotal,
    count: monthlyBills.length
  });
}

function getUnpaidBills() {
  var bills = mockUtils.getFromStorage(STORAGE_KEY, []);
  var unpaid = bills.filter(function (b) {
    return !b.paid;
  });
  unpaid.sort(function (a, b) {
    return new Date(a.dueDate) - new Date(b.dueDate);
  });
  return mockUtils.mockAsync(unpaid);
}

module.exports = {
  getBills: getBills,
  addBill: addBill,
  updateBill: updateBill,
  markPaid: markPaid,
  deleteBill: deleteBill,
  getUpcoming: getUpcoming,
  getMonthlyTotal: getMonthlyTotal,
  getUnpaidBills: getUnpaidBills
};
