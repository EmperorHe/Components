/**
 * 时间工具类
 * author： hyc
 * date: 2019/11/12
 *
 */

/**
 * 将日期格式化成指定格式的字符串
 * @param date 要格式化的日期，不传时默认当前时间，也可以是一个时间戳
 * @param fmt 目标字符串格式，支持的字符有：y,M,d,q,w,H,h,m,S，默认：yyyy-MM-dd HH:mm:ss
 * @returns 返回格式化后的日期字符串
 * 使用案例说明
 * formatDate(); // 2016-09-02 13:17:13
 * formatDate(new Date(), 'yyyy-MM-dd'); // 2016-09-02
 * formatDate(new Date(), 'yyyy-MM-dd 第q季度 www HH:mm:ss:SSS'); //2016-09-02 第3季度 星期五 13:19:15:792
 * formatDate(1472793615764); // 2016-09-02 13:20:15
 */
export function formatDate(date, fmt) {
  date = date === undefined ? new Date() : date
  date = typeof date === 'number' ? new Date(date) : date
  fmt = fmt || 'yyyy-MM-dd HH:mm:ss'
  var obj = {
    y: date.getFullYear(), // 年份，注意必须用getFullYear
    M: date.getMonth() + 1, // 月份，注意是从0-11
    d: date.getDate(), // 日期
    q: Math.floor((date.getMonth() + 3) / 3), // 季度
    w: date.getDay(), // 星期，注意是0-6
    H: date.getHours(), // 24小时制
    h: date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 12小时制
    m: date.getMinutes(), // 分钟
    s: date.getSeconds(), // 秒
    S: date.getMilliseconds() // 毫秒
  }
  var week = ['天', '一', '二', '三', '四', '五', '六']
  for (var i in obj) {
    fmt = fmt.replace(new RegExp(i + '+', 'g'), function(m) {
      var val = obj[i] + ''
      if (i === 'w') return (m.length > 2 ? '星期' : '周') + week[val]
      for (var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val
      return m.length === 1 ? val : val.substring(val.length - m.length)
    })
  }
  return fmt
}

/**
 * 将字符串解析成日期
 * @param str 输入的日期字符串，如'2014-09-13'
 * @param fmt 字符串格式，默认'yyyy-MM-dd'，支持如下：y、M、d、H、m、s、S，不支持w和q
 * @returns 解析后的Date类型日期
 * 使用方式
 * parseDate('2016-08-11'); // Thu Aug 11 2016 00:00:00 GMT+0800
 * parseDate('2016-08-11 13:28:43', 'yyyy-MM-dd HH:mm:ss') // Thu Aug 11 2016 13:28:43 GMT+0800
 */
export function parseDate(str, fmt) {
  fmt = fmt || 'yyyy-MM-dd'
  var obj = {
    y: 0,
    M: 1,
    d: 0,
    H: 0,
    h: 0,
    m: 0,
    s: 0,
    S: 0
  }
  fmt.replace(
    /([^yMdHmsS]*?)(([yMdHmsS])\3*)([^yMdHmsS]*?)/g,
    function(m, $1, $2, $3, $4) {
      str = str.replace(
        new RegExp($1 + '(\\d{' + $2.length + '})' + $4),
        function(_m, _$1) {
          obj[$3] = parseInt(_$1)
          return ''
        }
      )
      return ''
    }
  )
  obj.M-- // 月份是从0开始的，所以要减去1
  var date = new Date(obj.y, obj.M, obj.d, obj.H, obj.m, obj.s)
  if (obj.S !== 0) date.setMilliseconds(obj.S) // 如果设置了毫秒
  return date
}

/**
 * 时间加减
 * @param date(Date) 日期，Date类型，为空时代表当前时间
 * @param part(Char) 操作部分 {y:年, M:月, d:日, H:时, m:分, s:秒}
 * @param Int 相加的值，可以为负数
 */
export function addDate(date, part, value) {
  // 日期相加减
  date = date || new Date()
  if (part === 'y') {
    date.setTime(date.setFullYear(date.getFullYear() + value))
  } else if (part === 'M') {
    date.setTime(date.setMonth(date.getMonth() + value))
  } else if (part === 'd') {
    date.setTime(date.setDate(date.getDate() + value))
  } else if (part === 'H') {
    date.setTime(date.setHours(date.getHours() + value))
  } else if (part === 'm') {
    date.setTime(date.setMinutes(date.getMinutes() + value))
  } else if (part === 's') {
    date.setTime(date.setSeconds(date.getSeconds() + value))
  }
  return date
}
/**
 * 将一个日期格式化成友好格式，比如，1分钟以内的返回“刚刚”，
 * 当天的返回时分，当年的返回月日，否则，返回年月日
 * @param {Object} date
 */
export function formatDateToFriendly(date) {
  date = date || new Date()
  date = typeof date === 'number' ? new Date(date) : date
  var now = new Date()
  if (now.getTime() - date.getTime() < 60 * 1000) return '刚刚' // 1分钟以内视作“刚刚”
  var temp = this.formatDate(date, 'yyyy年M月d')
  if (temp === this.formatDate(now, 'yyyy年M月d')) {
    return this.formatDate(date, 'HH:mm')
  }
  if (date.getFullYear() === now.getFullYear()) {
    return this.formatDate(date, 'M月d日')
  }
  return temp
}
/**
 * 将一段时长转换成友好格式，如：
 * 147->“2分27秒”
 * 1581->“26分21秒”
 * 15818->“4小时24分”
 * @param {Object} second
 */
export function formatDurationToFriendly(second) {
  if (second < 60) {
    return second + '秒'
  } else if (second < 60 * 60) {
    return (second - (second % 60)) / 60 + '分' + (second % 60) + '秒'
  } else if (second < 60 * 60 * 24) {
    return (
      (second - (second % 3600)) / 60 / 60 +
      '小时' +
      Math.round((second % 3600) / 60) +
      '分'
    )
  } else {
    return (second / 60 / 60 / 24).toFixed(1) + '天'
  }
}
/**
 * 将时间转换成MM:SS形式
 */
export function formatTimeToFriendly(second) {
  var m = Math.floor(second / 60)
  m = m < 10 ? '0' + m : m
  var s = second % 60
  s = s < 10 ? '0' + s : s
  return m + ':' + s
}
/**
 * 将时间转换成HH:MM:SS形式
 */
export function formatTimeToHHMMSS(second) {
  var h = Math.floor(second / 3600)
  h = h < 10 ? '0' + h : h
  second = second - h * 3600
  var m = Math.floor(second / 60)
  m = m < 10 ? '0' + m : m
  var s = second % 60
  s = s < 10 ? '0' + s : s
  return h + ':' + m + ':' + s
}
/**
 * 判断某一年是否是闰年
 * @param year 可以是一个date类型，也可以是一个int类型的年份，不传默认当前时间
 */
// const isLeapYear = function(year) {
//   if (year === undefined) year = new Date()
//   if (year instanceof Date) year = year.getFullYear()
//   return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
// }
/**
 * 获取某一年某一月的总天数，没有任何参数时获取当前月份的
 * @param date(Date / int) 日期或年
 * @param month(int) 月
 * @return Int 指定月份天数
 * 方式一：$.getMonthDays();
 * 方式二：$.getMonthDays(new Date());
 * 方式三：$.getMonthDays(2013, 12);
 */
export function getMonthDays(date, month) {
  var y, m
  if (date === undefined) date = new Date()
  if (date instanceof Date) {
    y = date.getFullYear()
    m = date.getMonth()
  } else if (typeof date === 'number') {
    y = date
    m = month - 1
  }
  var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] // 非闰年的一年中每个月份的天数
  // 如果是闰年并且是2月
  if (m === 1 && this.isLeapYear(y)) return days[m] + 1
  return days[m]
}
/**
 * 计算两日期之间的天数, 精确到天,用的是比较毫秒数的方法
 * @param date1(Date) 日期一, 为空时为当前时间
 * @param date2(Date) 日期二, 为空时为当前时间
 * @return Int 相差天数
 */
export function diff(date1, date2) {
  date1 = date1 || new Date()
  date2 = date2 || new Date()
  // 将日期转换成字符串，转换的目的是去除“时、分、秒”
  if (date1 instanceof Date) {
    date1 = this.format(date1)
  }
  if (date2 instanceof Date) {
    date2 = this.format(date2)
  }
  date1 = this.parse(date1)
  date2 = this.parse(date2)
  return (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24)
}
/**
 * 计算2日期之间的天数，用的是比较毫秒数的方法
 * 传进来的日期要么是Date类型，要么是yyyy-MM-dd格式的字符串日期
 * @param date1 日期一
 * @param date2 日期二
 */
export function countDays(date1, date2) {
  var fmt = 'yyyy-MM-dd'
  date1 = date1 || new Date()
  date2 = date2 || new Date()
  // 将日期转换成字符串，转换的目的是去除“时、分、秒”
  if (date1 instanceof Date && date2 instanceof Date) {
    date1 = this.format(fmt, date1)
    date2 = this.format(fmt, date2)
  }
  if (typeof date1 === 'string' && typeof date2 === 'string') {
    date1 = this.parse(date1, fmt)
    date2 = this.parse(date2, fmt)
    return (date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24)
  } else {
    console.error('参数格式无效！')
    return 0
  }
}
/**
 * 获取指定时间所在月的第一天
 * @param date(Date) 日期,为空时代表当前时间
 * @return Date 指定月份第一天
 */
export function monthStartDate(date) {
  date = date || new Date()
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

/**
 * 获得指定日期所在周的周几
 * 每周开始时间为周日
 * @param date(Date) 日期,为空时代表当前时间
 * @param week(Int) 周几{1-7:周一至周日},默认为1
 * @return date(Date) 结果日期
 */
export function weekDay(date, week) {
  date = date || new Date()
  week = week || 1
  let addDays = 0
  addDays = -(date.getDay() === 0 ? 7 : date.getDay()) + week
  return this.format(this.add(date, 'd', addDays))
}
// 删除数组中特定的某一项
export function removeArrItem(removeArr, removeItem) {
  // eslint-disable-next-line no-extend-native
  Array.prototype.indexOf = function(val) {
    for (let i = 0; i < this.length; i++) {
      if (this[i] === val) return i
      if (this[i].name === val) return i
    }
    return -1
  }
  // eslint-disable-next-line no-extend-native
  Array.prototype.remove = function(val) {
    const index = this.indexOf(val)
    if (index > -1) {
      this.splice(index, 1)
    }
  }
  removeArr.remove(removeItem)
}
// export default {
//   countDays,
//   getMonthDays,
//   isLeapYear,
//   formatTimeToFriendly,
//   formatDurationToFriendly,
//   formatDateToFriendly,
//   parseDate,
//   formatDate,
//   addDate,
//   monthStartDate,
//   weekDay
// }
