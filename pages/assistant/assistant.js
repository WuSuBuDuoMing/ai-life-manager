/**
 * AI 生活助手页面
 * 基于关键词匹配的智能建议引擎，支持对话持久化
 */
var assistantService = require('../../services/assistant-service')
var themeBehavior = require('../../behaviors/theme-behavior')
var mockUtils = require('../../utils/mock-utils')

var CHAT_STORAGE_KEY = 'assistant_chat_messages'

Page({
  behaviors: [themeBehavior],

  data: {
    messages: [],
    inputValue: '',
    inputFocused: true,
    loading: false,
    quickQuestions: [
      { icon: '⏰', text: '我今天很忙怎么安排？' },
      { icon: '🍳', text: '冰箱这些东西能做什么？' },
      { icon: '✈️', text: '我要旅行要带什么？' },
      { icon: '🐕', text: '宠物今天要做什么？' },
      { icon: '💰', text: '怎么省钱？' },
      { icon: '✅', text: '怎么养成好习惯？' },
      { icon: '🧹', text: '家务怎么安排？' },
      { icon: '📊', text: '今天怎么样？' }
    ],
    pageReady: false
  },

  onLoad: function() {
    // 尝试恢复之前的对话
    var savedMessages = mockUtils.getFromStorage(CHAT_STORAGE_KEY, [])
    if (savedMessages && savedMessages.length > 0) {
      this.setData({ messages: savedMessages, pageReady: true })
    } else {
      var welcomeMsg = {
        id: 'welcome',
        role: 'assistant',
        content: '你好！我是你的 AI 生活助手 🤖\n\n我可以帮你处理各种生活问题：\n\n⏰ 时间管理 · 🍳 菜谱推荐\n✈️ 旅行准备 · 🐕 宠物照顾\n💰 理财建议 · ✅ 习惯养成\n🧹 家务安排 · 📊 生活摘要\n\n有什么想问的，尽管说吧！',
        suggestions: ['今天吃什么', '帮我安排时间', '今天怎么样'],
        timestamp: this._formatTime(new Date())
      }
      this.setData({ messages: [welcomeMsg], pageReady: true })
    }
  },

  onShow: function() {
    this._checkTheme()
  },

  onInput: function(e) {
    this.setData({ inputValue: e.detail.value })
  },

  onInputFocus: function() {
    this.setData({ inputFocused: true })
  },

  onSend: function() {
    var question = this.data.inputValue.trim()
    if (!question || this.data.loading) return
    this._sendMessage(question)
  },

  onQuickQuestion: function(e) {
    var text = e.currentTarget.dataset.text
    if (text && !this.data.loading) {
      this._sendMessage(text)
    }
  },

  onSuggestionTap: function(e) {
    var text = e.currentTarget.dataset.text
    if (text && !this.data.loading) {
      this._sendMessage(text)
    }
  },

  _sendMessage: function(question) {
    var that = this
    var userMsg = {
      id: 'user_' + Date.now(),
      role: 'user',
      content: question,
      timestamp: that._formatTime(new Date())
    }

    var messages = that.data.messages.concat([userMsg])
    that.setData({
      messages: messages,
      inputValue: '',
      loading: true
    })

    // 滚动到底部
    that._scrollToBottom()

    // 模拟 AI 思考延迟
    setTimeout(function() {
      assistantService.ask(question).then(function(result) {
        var assistantMsg = {
          id: 'ai_' + Date.now(),
          role: 'assistant',
          content: result.answer,
          suggestions: result.suggestions || [],
          relatedModule: result.relatedModule || '',
          timestamp: that._formatTime(new Date())
        }

        var updatedMessages = that.data.messages.concat([assistantMsg])
        that.setData({
          messages: updatedMessages,
          loading: false
        })

        // 持久化对话（最多保留最近 100 条）
        that._saveMessages(updatedMessages)
        that._scrollToBottom()
      }).catch(function(e) {
        console.error('[assistant] 请求失败:', e)
        var errorMsg = {
          id: 'error_' + Date.now(),
          role: 'assistant',
          content: '抱歉，我暂时无法回答这个问题。请稍后再试。',
          suggestions: [],
          timestamp: that._formatTime(new Date())
        }
        that.setData({
          messages: that.data.messages.concat([errorMsg]),
          loading: false
        })
      })
    }, 600)
  },

  onClearHistory: function() {
    var that = this
    wx.showModal({
      title: '清空对话',
      content: '确定要清空所有对话记录吗？',
      success: function(res) {
        if (res.confirm) {
          var welcomeMsg = {
            id: 'welcome_new',
            role: 'assistant',
            content: '对话已清空。有什么新问题想问我吗？ 😊',
            suggestions: ['今天吃什么', '帮我安排时间', '今天怎么样'],
            timestamp: that._formatTime(new Date())
          }
          that.setData({ messages: [welcomeMsg] })
          mockUtils.setToStorage(CHAT_STORAGE_KEY, [])
        }
      }
    })
  },

  /**
   * 持久化对话消息
   */
  _saveMessages: function(messages) {
    // 只保留最近 100 条，避免存储过大
    var toSave = messages.slice(-100)
    mockUtils.setToStorage(CHAT_STORAGE_KEY, toSave)
  },

  _scrollToBottom: function() {
    var that = this
    setTimeout(function() {
      that.setData({
        scrollToMessage: 'msg_' + (that.data.messages.length - 1)
      })
    }, 100)
  },

  _formatTime: function(date) {
    var h = String(date.getHours()).padStart(2, '0')
    var m = String(date.getMinutes()).padStart(2, '0')
    return h + ':' + m
  }
})
