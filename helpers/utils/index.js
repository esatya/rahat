const {DataUtils} = require('./data');
const ObjectUtils = require('./object');

class Utils {
  static getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

module.exports = {Utils, DataUtils, ObjectUtils};
