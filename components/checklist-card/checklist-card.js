/**
 * checklist-card 组件
 * 功能：清单卡片，展示清单信息、进度条和子项预览
 * 通过 properties 接收 checklist 对象，通过 triggerEvent 发送事件
 * 进度条颜色为绿色，完成后显示完成百分比
 */
Component({
  /**
   * 组件属性
   */
  properties: {
    /** 清单对象，包含 id, title, items, totalCount, completedCount, category */
    checklist: {
      type: Object,
      value: {
        id: '',
        title: '',
        items: [],
        totalCount: 0,
        completedCount: 0,
        category: ''
      }
    }
  },

  /**
   * 组件内部数据
   */
  data: {
    /** 进度百分比 */
    progressPercent: 0
  },

  /**
   * 监听属性变化，自动计算进度百分比
   */
  observers: {
    'checklist.completedCount, checklist.totalCount': function (completed, total) {
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0
      this.setData({ progressPercent: percent })
    }
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    attached() {
      const { completedCount = 0, totalCount = 0 } = this.data.checklist
      const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
      this.setData({ progressPercent: percent })
    }
  },

  /**
   * 组件方法
   */
  methods: {
    /**
     * 卡片点击事件
     * 向父组件触发 tap 事件，携带清单 id
     */
    onTap() {
      this.triggerEvent('tap', { id: this.data.checklist.id })
    }
  }
})
