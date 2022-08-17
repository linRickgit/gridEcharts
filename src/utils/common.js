import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export function getUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );
}


//时间戳转换方法    v:时间戳数字
export function formatDateTime(v) {
  var date = new Date(v);
  var YY = date.getFullYear() + '-';
  var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return YY + MM + DD +" "+hh + mm + ss;
}

//时间戳转换方法    v:时间戳数字
export function formatDate(v) {
  var date = new Date(v);
  var YY = date.getFullYear() + '-';
  var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  return YY + MM + DD;
}

export function exportTable(id, name){
  /* generate workbook object from table */
    var xlsxParam = { raw: true } // 导出的内容只做解析，不进行格式转换
    var wb = XLSX.utils.table_to_book(document.querySelector('#'+id), xlsxParam)

    /* get binary string as output */
    var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
    try {
      FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), name)
    } catch (e) {
      if (typeof console !== 'undefined') {
        console.log(e, wbout)
      }
    }
    return wbout
  }