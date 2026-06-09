/**
 * chore-card 组件
 * 功能：家务卡片，展示家务信息和完成操作
 * 通过 properties 接收 chore 对象，通过 triggerEvent 发送事件
 * 左侧状态条颜色随 status 变化：pending=橙色, completed=绿色
 */
Component({
  /**
   * 组件属性
   */
  properties: {
    /** 家务对象，包含 id, title, assignee, frequency, dueDate, status, points, room */
    chore: {
      type: Object,
      value: {
        id: '',
        title: '',
        assignee: '',
        frequency: '',
        dueDate: '',
        status: 'pending',
        points: 0,
        room: ''
      }
    }
  },

  /**
   * 组件内部数据
   */
  data: {
    /** 频率中文映射 */
    frequencyMap: {
      daily: '每天',
      weekly: '每周',
      biweekly: '每两周',
      monthly: '每月',
      yearly: '每年'
    },
    frequencyText: ''
  },

  /**
   * 计算属性
   */
  observers: {
    'chore.frequency': function (frequency) {
      const map = {
        daily: '每天',
        weekly: '每周',
        biweekly: '每两周',
        monthly: '每月',
        yearly: '每年'
      }
      this.setData({
        frequencyText: map[frequency] || frequency || ''
      })
    }
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    attached() {
      const map = {
        daily: '每天',
        weekly: '每周',
        biweekly: '每两周',
        monthly: '每月',
        yearly: '每年'
      }
      this.setData({
        frequencyText: map[this.data.chore.frequency] || this.data.chore.frequency || ''
      })
    }
  },

  /**
   * 组件方法
   */
  methods: {
    /**
     * 卡片整体点击
     * 向父组件触发 tap 事件
     */
    onTap() {
      this.triggerEvent('tap', { id: this.data.chore.id })
    },

    /**
     * 完成按钮点击
     * 使用 catchtap 阻止冒泡
     * 向父组件触发 complete 事件
     */
    onComplete() {
      this.triggerEvent('complete', {
        id: this.data.chore.id,
        status: this.data.chore.status
      })
    }
  }
})
