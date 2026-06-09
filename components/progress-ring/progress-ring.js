/**
 * progress-ring 组件
 * 功能：环形进度条，纯CSS实现（不使用canvas）
 * 通过左右半圆clip和rotate实现环形进度效果
 * 中间显示百分比文字或自定义文本
 */
Component({
  /**
   * 组件属性
   */
  properties: {
    /** 进度百分比 0-100 */
    percent: {
      type: Number,
      value: 0
    },
    /** 圆环尺寸（rpx） */
    size: {
      type: Number,
      value: 120
    },
    /** 圆环粗细（rpx） */
    strokeWidth: {
      type: Number,
      value: 8
    },
    /** 进度条颜色 */
    color: {
      type: String,
      value: '#4CAF50'
    },
    /** 是否显示中间文字 */
    showText: {
      type: Boolean,
      value: true
    },
    /** 自定义文字（为空时显示百分比） */
    text: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件内部数据
   */
  data: {
    /** 左半圆旋转角度 */
    leftDeg: 0,
    /** 右半圆旋转角度 */
    rightDeg: 0,
    /** 是否需要左半圆clip */
    leftClip: false,
    /** 是否需要右半圆clip */
    rightClip: false
  },

  /**
   * 监听 percent 变化，计算左右半圆角度
   * 原理：0-50% 只用左半圆，50-100% 左半圆满+右半圆增加
   */
  observers: {
    'percent': function (val) {
      var p = Math.max(0, Math.min(100, val))
      var deg = p * 3.6
      if (deg <= 180) {
        this.setData({ leftDeg: deg, rightDeg: 0, leftClip: true, rightClip: false })
      } else {
        this.setData({ leftDeg: 180, rightDeg: deg - 180, leftClip: true, rightClip: true })
      }
    }
  },

  /**
   * 组件生命周期 - 初始化计算
   */
  lifetimes: {
    attached: function () {
      var p = Math.max(0, Math.min(100, this.data.percent))
      var deg = p * 3.6
      if (deg <= 180) {
        this.setData({ leftDeg: deg, rightDeg: 0, leftClip: true, rightClip: false })
      } else {
        this.setData({ leftDeg: 180, rightDeg: deg - 180, leftClip: true, rightClip: true })
      }
    }
  }
})
