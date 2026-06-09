/**
 * 柱状图组件
 * 纯 CSS 实现，无需 canvas
 */
Component({
  properties: {
    data: { type: Array, value: [] },        // [{label, value, color}]
    height: { type: Number, value: 300 },     // 图表高度 rpx
    showValue: { type: Boolean, value: true },
    showLabel: { type: Boolean, value: true },
    maxValue: { type: Number, value: 0 },     // 0=自动计算
    barColor: { type: String, value: '#4CAF50' },
    barRadius: { type: Number, value: 8 }
  },
  data: {
    normalizedData: [],
    computedMax: 0
  },
  observers: {
    'data, maxValue': function(data, maxValue) {
      if (!data || data.length === 0) return
      var max = maxValue || Math.max.apply(null, data.map(function(d) { return d.value || 0 }))
      if (max === 0) max = 1
      var normalized = data.map(function(d) {
        return {
          label: d.label || '',
          value: d.value || 0,
          percent: Math.round((d.value || 0) / max * 100),
          color: d.color || ''
        }
      })
      this.setData({ normalizedData: normalized, computedMax: max })
    }
  }
})
