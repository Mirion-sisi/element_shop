// 格式化时间的函数，主要是正则表达式
export function formatDate(date, fmt) {
    // 1.获取年份
    // yyyy   2019
    // yyy    019
    // yy     19
    // y      9
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    // 2.获取月，日，时分秒
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    };
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + '';
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
      }
    }
    return fmt;
  };
  
  function padLeftZero (str) {
    return ('00' + str).substr(str.length);
  };



//   2.第二种格式化时间的方法
export function dateFormat(originVal){
    const dt=new Date(originVal)
    const y=dt.getFullYear()
    const m=(dt.getMonth()+1+'').padStart(2,'0')
    const d=(dt.getDate()+'').padStart(2,'0')
    const hh=(dt.getHours()+'').padStart(2,'0')
    const mm=(dt.getMinutes()+'').padStart(2,'0')
    const ss=(dt.getSeconds()+'').padStart(2,'0')
 
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}