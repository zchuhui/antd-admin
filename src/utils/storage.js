

export default {

  set: (key, jsonData, expirationMinute=30) => {
    // 默认缓存半个小时
    var expirationMS = expirationMinute * 60 * 1000;
    var record = {value: JSON.stringify(jsonData), timestamp: new Date().getTime() + expirationMS}
    localStorage.setItem(key, JSON.stringify(record));
    return jsonData;
  },

  get: key => {
    var record = JSON.parse(localStorage.getItem(key));
    if (!record) {
      return false;
    }
    return (new Date().getTime() < record.timestamp && JSON.parse(record.value));
  },

  remove: key => {
    "use strict";
    localStorage.removeItem(key);
  },
}