var request = require('request');
var EP = require('eventproxy');

var getCity = require('./getCity');
var getCode = require('./getCityCode');

var log = console.log.bind(console);

var url = {
    // 中国天气网 api
    realtime: 'http://www.weather.com.cn/data/sk/{{code}}.html',
    // 百度车联网 api
    seven: 'http://api.map.baidu.com/telematics/v3/weather?location={{city}}&output=json&ak={{api_key}}'
};

var CITY_CODE_REG = /[0-9]{9}/;
var CITY_NAME_REG = /[\u4e00-\u9fa5]{2,9}/;

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
 * 
 */
function gen(urlFn){
    return function(cityOrCode, callback){
        var cc = getCityAndCode(cityOrCode);
        if(cc === false){
            process.nextTick(function(){
                callback(new Error('wrong city code or name'));
            });
        }
        else{
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
                        callback(null, JSON.parse(body));
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
});

var getRealtime = gen(function(cc){
    return url.realtime.replace('{{code}}', cc.code);
});


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