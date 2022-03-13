function _Trim(s) {
  var m = s.match(/^\s*(\S+(\s+\S+)*)\s*$/)
  return m === null ? '' : m[1]
}

/**
 * 校验是否为邮箱
 * @param {*} s
 */
export function isEmail(s) {
  return /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(
    s
  )
}

/**
 * 校验是否为手机号码
 * @param {*} s
 */
// export function isMobile(s) {
//   return /^1[0-9]{10}$/.test(s)
// }
export function isMobile(s) {
  return /^(?:13\d|15[89])-?\d{5}(\d{3}|\*{3})$/.test(_Trim(s))
}
/**
 * 校验是否为中国大陆电话号码
 * @param {*} s
 */
export function isTel(s) {
  // 格式区号(2到4位)-电话号码(7到8位)-分机号(3位)"
  return /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(_Trim(s))
}

/**
 * 校验是否为电话号码
 * @param {*} s
 */
export function isPhone(s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * 校验是否为URL地址
 * @param {*} s
 */
export function isURL(s) {
  return /^http[s]?:\/\/.*/.test(s)
}

/**
 * 校验是否为合法身份证号
 * @param {string} idCard
 */
/* export function isIdCard(idCard) {
  const vcity = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外'
  }
  // 检查号码是否符合规范，包括长度，类型
  function isCardNo(card) {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    var reg = /(^\d{15}$)|(^\d{17}(\d|X|x)$)/
    if (reg.test(card) === false) {
      return false
    }
    return true
  }
  // 取身份证前两位，校验省份
  function checkProvince(card, vcity) {
    var province = card.substr(0, 2)
    if (vcity[province] === undefined) {
      return false
    }
    return true
  }
  // 检查生日是否正确
  function checkBirthday(card) {
    const len = card.length
    let arr_data = null
    let year = null
    let month = null
    let day = null
    let birthday = new Date(year + '/' + month + '/' + day)
    // 身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
    if (len === 15) {
      var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/
      arr_data = card.match(re_fifteen)
      year = arr_data[2]
      month = arr_data[3]
      day = arr_data[4]
      birthday = new Date('19' + year + '/' + month + '/' + day)
      return verifyBirthday('19' + year, month, day, birthday)
    }
    // 身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
    if (len === 18) {
      var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X|x)$/
      arr_data = card.match(re_eighteen)
      year = arr_data[2]
      month = arr_data[3]
      day = arr_data[4]
      birthday = new Date(year + '/' + month + '/' + day)
      return verifyBirthday(year, month, day, birthday)
    }
    return false
  }
  // 校验日期
  function verifyBirthday(year, month, day, birthday) {
    var now = new Date()
    var now_year = now.getFullYear()
    // 年月日是否合理
    if (
      birthday.getFullYear() === year &&
      birthday.getMonth() + 1 === month &&
      birthday.getDate() === day
    ) {
      // 判断年份的范围（0岁到100岁之间)
      var time = now_year - year
      if (time >= 0 && time <= 100) {
        return true
      }
      return false
    }
    return false
  }
  // 校验位的检测
  function checkParity(card) {
    // 15位转18位
    card = changeFivteenToEighteen(card)
    var len = card.length
    if (len === 18) {
      var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
      var cardTemp = 0
      var i
      var valnum
      for (i = 0; i < 17; i++) {
        cardTemp += card.substr(i, 1) * arrInt[i]
      }
      valnum = arrCh[cardTemp % 11]
      if (valnum === card.substr(17, 1).toLocaleUpperCase()) {
        return true
      }
      return false
    }
    return false
  }
  // 15位转18位身份证号
  function changeFivteenToEighteen(card) {
    if (card.length === 15) {
      var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
      var cardTemp = 0
      var i
      card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6)
      for (i = 0; i < 17; i++) {
        cardTemp += card.substr(i, 1) * arrInt[i]
      }
      card += arrCh[cardTemp % 11]
      return card
    }
    return card
  }

  // 是否为空
  if (idCard === '') {
    return false
  }
  // 校验长度，类型
  if (isCardNo(idCard) === false) {
    return false
  }
  // 检查省份
  if (checkProvince(idCard, vcity) === false) {
    return false
  }
  // 校验生日
  if (checkBirthday(idCard) === false) {
    return false
  }
  // 检验位的检测
  if (checkParity(idCard) === false) {
    return false
  }
  return true
} */

export function isIdCard(id) {
  const that = {}
  that.isOK = false
  that.error = ''

  if (
    !id ||
    typeof id !== 'string' ||
    (id.length !== 15 && id.length !== 18) ||
    (!id.match(/^[0-9]{15}$/) && !id.match(/^[0-9]{17}[0-9xX]$/)) ||
    id === '111111111111111'
  ) {
    that.error = '输入不是15位或者18位有效字符串'
    return false
  }

  var area = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外'
  }

  that.areaName = area[id.substr(0, 2)]
  if (!that.areaName) {
    that.error = '前2位不是有效的行政区划代码'
    return false
  }

  if (id.length === 15) {
    that.year = parseInt(id.substr(6, 2))
    that.month = parseInt(id.substr(8, 2))
    that.day = parseInt(id.substr(10, 2))
  } else {
    that.year = parseInt(id.substr(6, 4))
    that.month = parseInt(id.substr(10, 2))
    that.day = parseInt(id.substr(12, 2))
  }

  that.error = '出生日期不正确'
  if (that.month > 12) {
    return false
  }
  if (that.day > 31) {
    return false
  }
  // February can't be greater than 29 (leap year calculation comes later)
  if (that.month === 2 && that.day > 29) {
    return false
  }
  // check for months with only 30 days
  if (
    that.month === 4 ||
    that.month === 6 ||
    that.month === 9 ||
    that.month === 11
  ) {
    if (that.day > 30) {
      return false
    }
  }
  // if 2-digit year, use 50 as a pivot date
  if (that.year < 100) {
    that.year += 1900
  }
  if (that.year > 9999) {
    return false
  }
  // check for leap year if the month and day is Feb 29
  if (that.month === 2 && that.day === 29) {
    var div4 = that.year % 4
    var div100 = that.year % 100
    var div400 = that.year % 400
    // if not divisible by 4, then not a leap year so Feb 29 is invalid
    if (div4 !== 0) {
      return false
    }
    // at this point, year is divisible by 4. So if year is divisible by
    // 100 and not 400, then it's not a leap year so Feb 29 is invalid
    if (div100 === 0 && div400 !== 0) {
      return false
    }
  }
  that.yearStr = '' + that.year
  that.monthStr = (that.month < 10 ? '0' : '') + that.month
  that.dayStr = (that.day < 10 ? '0' : '') + that.day

  // date is valid
  var birthDay = new Date(that.year, that.month - 1, that.day)

  if (birthDay - new Date() >= 0 || birthDay - new Date(1850, 1, 1) <= 0) {
    return false
  }

  that.error = ''
  var lastNum = id.length === 15 ? id.substr(14, 1) : id.substr(16, 1)
  that.sex =
    lastNum === '1' ||
    lastNum === '3' ||
    lastNum === '5' ||
    lastNum === '7' ||
    lastNum === '9'
      ? '1'
      : '0'
  that.sexName = that.sex === '1' ? '男' : '女'
  if (id.length === 15) {
    that.isOK = true
    return true
  }

  var getLastValidationLetter = function(str) {
    var strArray = new Array(17)
    // 存储身份证的前17为数字
    var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]
    // 表示第i位置上的加权因子
    var Y = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
    // 校验码值
    var S = 0
    // 十七位数字本体码加权求和
    var jym = 0
    // 校验码

    for (var i = 16; i >= 0; i -= 1) {
      strArray[i] = Number(str.charAt(i))
    }

    for (var j = 16; j >= 0; j -= 1) {
      S += strArray[j] * Wi[j]
    }

    jym = S % 11
    return Y[jym]
  }

  if (id.substr(17, 1) !== getLastValidationLetter(id.substr(0, 17))) {
    that.error = '18位身份证编码最后一位校验码不正确'
    return false
  }

  that.isOK = true
  return true
}
