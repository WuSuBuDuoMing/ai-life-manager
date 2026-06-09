/**
 * food-card 组件
 * 功能：食品卡片，展示食品名称、数量、存储位置、保质期状态
 * 保质期状态：新鲜(绿色)、临期<3天(橙色)、过期(红色)
 * 通过 properties 接收 item 对象，通过 triggerEvent 发送事件
 */
Component({
  /**
   * 组件属性
   */
  properties: {
    /** 食品对象，包含 id, name, category, expiryDate, quantity, unit, storageLocation */
    item: {
      type: Object,
      value: {
        id: '',
        name: '',
        category: '',
        expiryDate: '',
        quantity: 0,
        unit: '',
        storageLocation: ''
      }
    }
  },

  /**
   * 组件内部数据
   */
  data: {
    /** 保质期状态：fresh(新鲜), expiring(临期), expired(过期) */
    expiryStatus: 'fresh',
    /** 保质期状态文本 */
    expiryText: '新鲜',
    /** 距离过期天数 */
    daysLeft: 0
  },

  /**
   * 监听属性变化，自动计算保质期状态
   */
  observers: {
    'item.expiryDate': function (date) {
      this.calcExpiryStatus(date)
    }
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    attached() {
      this.calcExpiryStatus(this.data.item.expiryDate)
    }
  },

  /**
   * 组件方法
   */
  methods: {
    /**
     * 计算保质期状态
     * @param {string} expiryDate - 过期日期字符串
     */
    calcExpiryStatus(expiryDate) {
      if (!expiryDate) {
        this.setData({ expiryStatus: 'fresh', expiryText: '未知', daysLeft: -1 })
        return
      }
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      const expiry = new Date(expiryDate)
      expiry.setHours(0, 0, 0, 0)
      const diff = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))

      if (diff < 0) {
        this.setData({ expiryStatus: 'expired', expiryText: '已过期', daysLeft: diff })
      } else if (diff <= 3) {
        this.setData({ expiryStatus: 'expiring', expiryText: diff + '天后过期', daysLeft: diff })
      } else {
        this.setData({ expiryStatus: 'fresh', expiryText: '新鲜', daysLeft: diff })
      }
    },

    /** 编辑事件 */
    onEdit() {
      this.triggerEvent('edit', { id: this.data.item.id })
    },

    /** 删除事件 */
    onDelete() {
      this.triggerEvent('delete', { id: this.data.item.id })
    },

    /** 加入购物清单事件 */
    onAddToShopping() {
      this.triggerEvent('addToShopping', { id: this.data.item.id, name: this.data.item.name })
    }
  }
})
