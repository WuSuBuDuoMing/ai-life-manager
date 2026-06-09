/**
 * room-zone-card 组件
 * 功能：房间区域卡片，大图标+名称+进度条+完成数/任务数
 * 通过 properties 接收 zone 对象，通过 triggerEvent 发送 tap 事件
 */
Component({
  /** 组件属性 */
  properties: {
    /** 区域对象，包含 id, name, icon, taskCount, completedCount, progress */
    zone: {
      type: Object,
      value: {
        id: '',
        name: '',
        icon: '🏠',
        taskCount: 0,
        completedCount: 0,
        progress: 0
      }
    }
  },

  /** 组件数据 */
  data: {
    /** 进度百分比 */
    progressPercent: 0
  },

  /** 监听属性变化，自动计算进度 */
  observers: {
    'zone.completedCount, zone.taskCount': function (completed, total) {
      var p = total > 0 ? Math.round((completed / total) * 100) : 0
      this.setData({ progressPercent: Math.min(100, Math.max(0, p)) })
    }
  },

  /** 组件生命周期 */
  lifetimes: {
    attached: function () {
      var z = this.data.zone
      var p = z.taskCount > 0 ? Math.round((z.completedCount / z.taskCount) * 100) : (z.progress || 0)
      this.setData({ progressPercent: Math.min(100, Math.max(0, p)) })
    }
  },

  /** 组件方法 */
  methods: {
    /** 卡片点击事件 */
    onTap: function () {
      this.triggerEvent('tap', { id: this.data.zone.id })
    }
  }
})
