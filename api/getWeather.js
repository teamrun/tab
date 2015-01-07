var path = require('path');

var request = require('request');
var EP = require('eventproxy');

var makeDouble = require('../util').makeDouble;

var getCity = require('./getCity');
var getCode = require('./getCityCode');
var persistData = require('./persistData');

var weatherRealtimeJsonFile = path.join(config.jsonPath, './weatherRealtime.json');
var weatherForecastJsonFile = path.join(config.jsonPath, './weatherForecast.json');

// city: [weather data list]
var weatherRealtimeData = persistData.get(weatherRealtimeJsonFile);
var weatherForecastData = persistData.get(weatherForecastJsonFile);

var log = console.log.bind(console);

var url = {
    // 中国天气网 api
    realtime: 'http://www.weather.com.cn/data/sk/{{code}}.html',
    // 百度车联网 api
    seven: 'http://api.map.baidu.com/telematics/v3/weather?location={{city}}&output=json&ak={{api_key}}'
};

var CITY_CODE_REG = /[0-9]{9}/;
var CITY_NAME_REG = /[\u4e00-\u9fa5]{2,9}/;
var TIMEZONE_OFFSET = 8;

// ------------ 实时天气数据的缓存 取 和 存 ------------
function hasRealtimeCache(cc){
    var code = cc.code;
    if(weatherRealtimeData[code]){
        /* 
         * 判断实时天气数据是否过期
         */
        var now = Date.now();
        // 30分钟前的都算过期
        var notOutDataTime = new Date(now - (30*60*1000));
        var notOutDataStr = makeDouble(notOutDataTime.getHours()) + ':'+makeDouble(notOutDataTime.getMinutes());

        var count = weatherRealtimeData[code].length;
        if(count >0 ){
            var last = weatherRealtimeData[code][count-1];
            var data = last.weatherinfo;
            // 时间戳上晚于过期, 而且不是前一天的...
            log('compare: now:', notOutDataStr, 'last: ', data.time );
            if( data.time > notOutDataStr && data.time.indexOf('23') !==0 ){
                return last;
            }
            return false;
        }
        else{
            return false;
        }
    }
    return false;
}

function saveRealtimeData(cc, data){
    var code = cc.code;
    if( !weatherRealtimeData[code] ){
        weatherRealtimeData[code] = [];
    }
    // 添加pubTs;
    // var now = new Date();
    // var pubTime = data.weatherinfo.time;
    // var pubTimeArr = pubTime.split(':');
    // var pubTimeMinutes = parseInt(pubTimeArr[0]) * 60 + parseInt(pubTimeArr[1]);
    // var pusTs = (new Date(now.getFullYear() +'-'+(now.getMonth()+1)+'-'+(now.getDate()) )).valueOf() + (TIMEZONE_OFFSET*3600*1000) + pubTimeMinutes*60*1000;

    // data.weatherinfo.pubTs = pusTs;
    weatherRealtimeData[code].push(data);
    persistData.set(weatherRealtimeData, weatherRealtimeJsonFile);
}
// ------------ end of 实时天气数据的缓存 取 和 存 ------------

// ------------ 天气预报数据的缓存 取 和 存 ------------
function hasForecastCache(cc){
    var city = cc.city;
    if(weatherForecastData[city]){
        // 检查是否过期
        var now = new Date();
        // 今天的yyyy-MM-dd
        var dateStr = (now.getFullYear()) + '-' + makeDouble(now.getMonth()+1) + '-' + makeDouble(now.getDate());

        var count = weatherForecastData[city].length;
        if(count <= 0){
            return false;
        }
        else{
            var last = weatherForecastData[city][count-1];
            log('compare: now:', dateStr, 'last: ', last.date );
            if( dateStr == last.date ){
                return last;
            }
            return false;
        }
    }
    else{
        return false;
    }
}

function saveForecastData(cc, data){
    var city = cc.city;
    if(!weatherForecastData[city]){
        weatherForecastData[city] = [];
    }
    weatherForecastData[city].push(data);
    persistData.set( weatherForecastData, weatherForecastJsonFile );
}
// ------------ end of天气预报数据的缓存 取 和 存 ------------


// 通过一个模糊的参数 获取城市名称和代码
function getCityAndCode(cityOrCode){
    var code, city;
    if(CITY_CODE_REG.test(cityOrCode)){
        code = cityOrCode;
        city = getCity(code);
    }
    else if(CITY_NAME_REG.test(cityOrCode)){
        city = cityOrCode;
        code = getCode(city);
    }
    else{
        return false;
    }
    return {
        code: code,
        city: city
    };
}
/* 生成function: 因为两个方法都是很雷同的
 *      获取城市和代码 -> 拼接url -> 发送请求 -> 调用callback
 * 因此就构造一个可以生产function的函数, 接收[拼接url的function]
 * 
 * 拓展: 增加取缓存 和 存入缓存 的操作
 */
function gen(urlFn, hasCache, saveToCache){
    return function(cityOrCode, callback){
        var cc = getCityAndCode(cityOrCode);
        if(cc === false){
            process.nextTick(function(){
                callback(new Error('wrong city code or name'));
            });
        }
        else{
            // 有cache就读取cache
            var cache = hasCache(cc);
            if(cache !== false){
                log('got cached data:', hasCache.name);
                process.nextTick(function(){
                    callback(null, cache);
                });
                return;
            }
            // 没有就去获取, 然后存进cache
            var url = urlFn(cc);
            log('gonna request: ', url);
            request(url, function(err, res, body){
                if(err){
                    callback(err);
                }
                else{
                    if(res.statusCode != 200){
                        callback(new Error('got wrong response status code: '+ res.statusCode));
                    }
                    else{
                        try{
                            var data = JSON.parse(body);
                        }
                        catch(err){
                            log(err);
                            callback(new Error('parse res body err:'+err.message));
                            return;
                        }
                        
                        callback(null, data);
                        saveToCache(cc, data);
                    }
                }
            });
        }
    }
}

var getSeven = gen(function(cc){
    if(config.baidu_api_key == undefined){
        log('警告: 没有可用的百度api key!');
    }
    return url.seven.replace('{{city}}', cc.city).replace('{{api_key}}', config.baidu_api_key);
}, hasForecastCache, saveForecastData);

var getRealtime = gen(function(cc){
    return url.realtime.replace('{{code}}', cc.code);
}, hasRealtimeCache, saveRealtimeData);


function getAll(cityOrCode, callback){
    var ep = new EP();
    ep.all('seven', 'realtime', function(seven, realtime){
        callback(null, seven, realtime);
    });
    ep.fail(callback);

    getSeven(cityOrCode, ep.done('seven') );
    getRealtime(cityOrCode, ep.done('realtime') );
}


module.exports = {
    all: getAll,
    realtime: getRealtime,
    seven: getSeven
}