// get city by code
var cityCodeData = require('../data/cityCode.json');

module.exports = function(code){
    for(var i in cityCodeData){
        if( cityCodeData[i] === code ){
            return i;
        }
    }
    return false;
}