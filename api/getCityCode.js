// get code by city name
var cityCodeData = require('../data/cityCode.json');

module.exports = function(city){
    return cityCodeData[city];
}