/**
 * subscription-card 组件
 * 功能：订阅服务卡片，展示订阅信息
 * 通过 properties 接收 subscription 对象，通过 triggerEvent 发送事件
 * 自动检测续费日期，7天内续费显示橙色警告边框
 */
Component({
  /**
   * 组件属性
   */
  properties: {
    /** 订阅对象，包含 id, name, price, billingCycle, nextBillingDate, category, autoRenew, icon */
    subscription: {
      type: Object,
      value: {
        id: '',
        name: '',
        price: 0,
        billingCycle: 'monthly',
        nextBillingDate: '',
        category: '',
        autoRenew: false,
        icon: '📦'
      }
    }
  },

  /**
   * 组件内部数据
   */
  data: {
    /** 周期中文文本 */
    cycleText: '',
    /** 是否即将续费（7天内） */
    isRenewingSoon: false,
    /** 距离续费天数 */
    daysUntilRenew: 0
  },

  /**
   * 周期映射表
   */
  lifecycleMap: {
    weekly: '周',
    biweekly: '双周',
    monthly: '月',
    quarterly: '季',
    yearly: '年'
  },

  /**
   * 监听属性变化，自动计算续费状态
   */
  observers: {
    'subscription.billingCycle': function (cycle) {
      const map = {
        weekly: '周',
        biweekly: '双周',
        monthly: '月',
        quarterly: '季',
        yearly: '年'
      }
      this.setData({ cycleText: map[cycle] || cycle || '月' })
    },
    'subscription.nextBillingDate': function (date) {
      this.checkRenewDate(date)
    }
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    attached() {
      const { billingCycle = 'monthly', nextBillingDate = '' } = this.data.subscription
      const map = {
        weekly: '周',
        biweekly: '双周',
        monthly: '月',
        quarterly: '季',
        yearly: '年'
      }
      this.setData({ cycleText: map[billingCycle] || billingCycle || '月' })
      this.checkRenewDate(nextBillingDate)
    }
  },

  /**
   * 组件方法
   */
  methods: {
    /**
     * 检查续费日期是否在7天内
     * @param {string} dateStr - 续费日期字符串
     */
    checkRenewDate(dateStr) {
      if (!dateStr) {
        this.setData({ isRenewingSoon: false, daysUntilRenew: 0 })
        return
      }
      const now = new Date()
      const renewDate = new Date(dateStr)
      const diff = Math.ceil((renewDate - now) / (1000 * 60 * 60 * 24))
      this.setData({
        isRenewingSoon: diff >= 0 && diff <= 7,
        daysUntilRenew: diff >= 0 ? diff : 0
      })
    },

    /**
     * 卡片点击事件
     */
    onTap() {
      this.triggerEvent('tap', { id: this.data.subscription.id })
    },

    /**
     * 编辑按钮点击
     * 使用 catchtap 阻止冒泡
     */
    onEdit() {
      this.triggerEvent('edit', { id: this.data.subscription.id })
    }
  }
})
