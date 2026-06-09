/**
 * task-card 组件
 * 功能：任务卡片，展示任务信息，支持完成状态切换
 * 通过 properties 接收任务数据，通过 triggerEvent 向父组件发送事件
 */
Component({
  /**
   * 组件属性
   */
  properties: {
    /** 任务对象，包含 id, title, dueDate, assignee, status, priority */
    task: {
      type: Object,
      value: {
        id: '',
        title: '',
        dueDate: '',
        assignee: '',
        status: 'pending',   // pending | in_progress | completed
        priority: 'normal'   // low | normal | high | urgent
      }
    },
    /** 是否显示负责人标签 */
    showAssignee: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件内部数据
   */
  data: {
    /** 优先级中文映射 */
    priorityMap: {
      low: '低',
      normal: '普通',
      high: '高',
      urgent: '紧急'
    },
    /** 状态中文映射 */
    statusMap: {
      pending: '待办',
      in_progress: '进行中',
      completed: '已完成'
    }
  },

  /**
   * 计算属性 - 监听 task 变化自动更新显示文本
   */
  observers: {
    'task.priority': function (priority) {
      this.setData({
        priorityText: this.data.priorityMap[priority] || '普通'
      })
    },
    'task.status': function (status) {
      this.setData({
        statusText: this.data.statusMap[status] || '待办'
      })
    }
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    attached() {
      // 初始化显示文本
      this.setData({
        priorityText: this.data.priorityMap[this.data.task.priority] || '普通',
        statusText: this.data.statusMap[this.data.task.status] || '待办'
      })
    }
  },

  /**
   * 组件方法
   */
  methods: {
    /**
     * 卡片整体点击事件
     * 向父组件触发 tap 事件，携带任务 id
     */
    onTap() {
      this.triggerEvent('tap', { id: this.data.task.id })
    },

    /**
     * 完成按钮点击事件（复选框）
     * 使用 catchtap 阻止冒泡，避免同时触发 onTap
     * 向父组件触发 complete 事件，携带任务 id 和当前状态
     */
    onComplete() {
      this.triggerEvent('complete', {
        id: this.data.task.id,
        status: this.data.task.status
      })
    }
  }
})
