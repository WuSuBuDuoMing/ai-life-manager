// 日期工具模块
function formatDate(date, format) {
  format = format || 'YYYY-MM-DD'
  var d = _toDate(date)
  var y = d.getFullYear(), mo = String(d.getMonth()+1).padStart(2,'0'), dy = String(d.getDate()).padStart(2,'0')
  var h = String(d.getHours()).padStart(2,'0'), mi = String(d.getMinutes()).padStart(2,'0'), s = String(d.getSeconds()).padStart(2,'0')
  return format.replace('YYYY',y).replace('MM',mo).replace('DD',dy).replace('HH',h).replace('mm',mi).replace('ss',s)
}
function formatDateTime(date) { return formatDate(date, 'YYYY-MM-DD HH:mm') }
function getWeekRange(date) {
  var d=_toDate(date), day=d.getDay(), diff=d.getDate()-day+(day===0?-6:1)
  var mon=new Date(d); mon.setDate(diff); var sun=new Date(mon); sun.setDate(mon.getDate()+6)
  return {start:formatDate(mon),end:formatDate(sun)}
}
function getMonthRange(date) {
  var d=_toDate(date),y=d.getFullYear(),m=d.getMonth()
  return {start:formatDate(new Date(y,m,1)),end:formatDate(new Date(y,m+1,0))}
}
function isToday(date) { var d=_toDate(date),t=new Date(); return d.getFullYear()===t.getFullYear()&&d.getMonth()===t.getMonth()&&d.getDate()===t.getDate() }
function isExpired(date) { var d=_toDate(date),t=new Date(); t.setHours(0,0,0,0); d.setHours(0,0,0,0); return d<t }
function isExpiringSoon(date,days) { days=days||3; var d=_toDate(date),t=new Date(); t.setHours(0,0,0,0); d.setHours(0,0,0,0); var df=d.getTime()-t.getTime(); return df>=0&&df<=days*86400000 }
function daysUntil(date) { var d=_toDate(date),t=new Date(); t.setHours(0,0,0,0); d.setHours(0,0,0,0); return Math.round((d.getTime()-t.getTime())/86400000) }
function daysBetween(a,b) { var d1=_toDate(a),d2=_toDate(b); d1.setHours(0,0,0,0); d2.setHours(0,0,0,0); return Math.round(Math.abs(d2.getTime()-d1.getTime())/86400000) }
function getRelativeTime(date) { var d=daysUntil(date); if(d===0)return'今天'; if(d===1)return'明天'; if(d===-1)return'昨天'; if(d>1&&d<=7)return d+'天后'; if(d<-1&&d>=-7)return Math.abs(d)+'天前'; if(d>7)return formatDate(date,'MM-DD'); return '已过期'+Math.abs(d)+'天' }
function getWeekday(date) { return ['周日','周一','周二','周三','周四','周五','周六'][_toDate(date).getDay()] }
function getMonthDays(month,year) { return new Date(year||new Date().getFullYear(),month,0).getDate() }
function addDays(date,days) { var d=_toDate(date); d.setDate(d.getDate()+days); return d }
function isSameWeek(a,b) { return getWeekRange(a).start===getWeekRange(b).start }
function getGreeting() { var h=new Date().getHours(); if(h<6)return'夜深了，注意休息 🌙'; if(h<9)return'早上好，新的一天开始啦 ☀️'; if(h<12)return'上午好，今天也要加油 💪'; if(h<14)return'中午好，吃午饭了吗 🍜'; if(h<18)return'下午好，喝杯茶休息一下 🍵'; if(h<21)return'晚上好，辛苦了一天 🌆'; return '夜晚好，早点休息哦 🌙' }
function _toDate(date) { if(date instanceof Date)return new Date(date.getTime()); if(typeof date==='string')return new Date(date.replace(/-/g,'/')); return new Date() }
module.exports = {formatDate:formatDate,formatDateTime:formatDateTime,getWeekRange:getWeekRange,getMonthRange:getMonthRange,isToday:isToday,isExpired:isExpired,isExpiringSoon:isExpiringSoon,daysUntil:daysUntil,daysBetween:daysBetween,getRelativeTime:getRelativeTime,getWeekday:getWeekday,getMonthDays:getMonthDays,addDays:addDays,isSameWeek:isSameWeek,getGreeting:getGreeting}
