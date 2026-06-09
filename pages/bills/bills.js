/**
 * 账单与生活支出页面
 * 提供账单管理、付款追踪、分类统计等功能
 */
var billService = require('../../services/bill-service')
var themeBehavior = require('../../behaviors/theme-behavior')

Page({
  behaviors: [themeBehavior],

  data: {
    bills: [],
    unpaidBills: [],
    upcomingBills: [],
    monthlyTotal: null,
    currentTab: 0,
    tabs: ['全部账单', '待支付', '即将到期'],
    loading: true,
    showAddForm: false,
    newBill: {
      name: '',
      amount: '',
      dueDate: '',
      category: '住房',
      recurring: false,
      frequency: '每月'
    },
    categories: ['住房', '水电', '通讯', '订阅', '贷款', '保险', '其他'],
    frequencies: ['一次性', '每月', '每季', '每年'],
    categoryIcons: {
      '住房': '🏠', '水电': '💡', '通讯': '📱',
      '订阅': '🎬', '贷款': '💳', '保险': '🛡️', '其他': '📋'
    },
    // 统计
    totalUnpaid: 0,
    totalAmount: 0
  },

  onLoad: function() {
    this.loadData()
  },

  onShow: function() {
    this._checkTheme()
    this.loadData()
  },

  onPullDownRefresh: function() {
    this.loadData()
    wx.stopPullDownRefresh()
  },

  loadData: function() {
    var that = this
    that.setData({ loading: true })

    billService.getBills().then(function(bills) {
      var now = new Date()
      now.setHours(0, 0, 0, 0)
      var sevenDays = new Date(now)
      sevenDays.setDate(sevenDays.getDate() + 7)

      var unpaid = bills.filter(function(b) { return !b.paid })
      var upcoming = unpaid.filter(function(b) {
        var due = new Date(b.dueDate)
        return due >= now && due <= sevenDays
      }).sort(function(a, b) {
        return new Date(a.dueDate) - new Date(b.dueDate)
      })

      // 计算逾期天数
      bills = bills.map(function(b) {
        var due = new Date(b.dueDate)
        due.setHours(0, 0, 0, 0)
        var diff = Math.ceil((now - due) / 86400000)
        b.overdue = !b.paid && diff > 0
        b.overdueDays = b.overdue ? diff : 0
        b.daysUntilDue = diff <= 0 ? Math.abs(diff) : 0
        return b
      })

      var totalUnpaid = unpaid.reduce(function(s, b) { return s + b.amount }, 0)

      that.setData({
        bills: bills,
        unpaidBills: unpaid,
        upcomingBills: upcoming,
        totalUnpaid: totalUnpaid,
        totalAmount: bills.reduce(function(s, b) { return s + b.amount }, 0),
        loading: false
      })

      // 月度统计
      billService.getMonthlyTotal().then(function(total) {
        that.setData({ monthlyTotal: total })
      }).catch(function() {})
    }).catch(function(e) {
      console.error('[bills] 加载数据失败:', e)
      that.setData({ loading: false })
    })
  },

  onTabChange: function(e) {
    this.setData({ currentTab: parseInt(e.currentTarget.dataset.index) })
  },

  onMarkPaid: function(e) {
    var id = e.currentTarget.dataset.id
    var that = this
    billService.markPaid(id).then(function() {
      wx.vibrateShort({ type: 'medium' })
      wx.showToast({ title: '已标记付款', icon: 'success' })
      that.loadData()
    }).catch(function() {
      wx.showToast({ title: '操作失败', icon: 'none' })
    })
  },

  onDeleteBill: function(e) {
    var id = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个账单吗？',
      confirmColor: '#EF5350',
      success: function(res) {
        if (res.confirm) {
          billService.deleteBill(id).then(function() {
            wx.showToast({ title: '已删除', icon: 'success' })
            that.loadData()
          }).catch(function() {
            wx.showToast({ title: '删除失败', icon: 'none' })
          })
        }
      }
    })
  },

  toggleAddForm: function() {
    this.setData({ showAddForm: !this.data.showAddForm })
  },

  onNewBillInput: function(e) {
    var field = e.currentTarget.dataset.field
    var obj = {}
    obj['newBill.' + field] = e.detail.value
    this.setData(obj)
  },

  onCategorySelect: function(e) {
    this.setData({ 'newBill.category': e.currentTarget.dataset.category })
  },

  onDueDateChange: function(e) {
    this.setData({ 'newBill.dueDate': e.detail.value })
  },

  onFrequencyChange: function(e) {
    var idx = parseInt(e.detail.value)
    var freq = this.data.frequencies[idx]
    this.setData({
      'newBill.frequency': freq,
      'newBill.recurring': freq !== '一次性'
    })
  },

  confirmAddBill: function() {
    var bill = this.data.newBill
    if (!bill.name) {
      wx.showToast({ title: '请输入账单名称', icon: 'none' })
      return
    }
    if (!bill.amount) {
      wx.showToast({ title: '请输入金额', icon: 'none' })
      return
    }
    if (!bill.dueDate) {
      wx.showToast({ title: '请选择到期日期', icon: 'none' })
      return
    }
    var that = this
    var icon = this.data.categoryIcons[bill.category] || '📋'
    billService.addBill({
      name: bill.name,
      amount: parseFloat(bill.amount),
      dueDate: bill.dueDate,
      category: bill.category,
      recurring: bill.recurring,
      frequency: bill.frequency,
      icon: icon
    }).then(function() {
      that.setData({
        showAddForm: false,
        newBill: { name: '', amount: '', dueDate: '', category: '住房', recurring: false, frequency: '每月' }
      })
      wx.showToast({ title: '添加成功', icon: 'success' })
      that.loadData()
    }).catch(function() {
      wx.showToast({ title: '添加失败', icon: 'none' })
    })
  }
})
