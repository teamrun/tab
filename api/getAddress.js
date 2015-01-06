var path = require('path');
var request = require('request');
var persistData = require('./persistData');

var ipAddressData = require('../data/ipAddress.json');
var ipAddressJsonFile = path.join(__dirname, '../data/ipAddress.json');


var TB_IP_LIB = 'http://ip.taobao.com/service/getIpInfo.php';

function getAddByIp(ip, callback){
    // 现从持久化的缓存里读取
    if(ipAddressData[ip]){
        process.nextTick(function(){
            callback(null, ipAddressData[ip]);
        });
        return;
    }

    request(TB_IP_LIB + '?ip=' + ip, function(err, res, body){
        if(err == null ){
            var sc = res.statusCode;
            if(sc == 200){
                var data = JSON.parse(body);
                if(data.code === 0){
                    callback(null, data.data);
                    // 将数据缓存起来
                    ipAddressData[ip] = data.data;
                    persistData(ipAddressData, ipAddressJsonFile);
                }
                else{
                    callback( new Error('got wrong res body code: '+ data.code + ', msg: '+ data.data));
                }
            }
            else{
                callback( new Error('got wrong status code: '+ sc));
            }
        }
        else{
            callback(err);
        }
    });
}

module.exports = getAddByIp;
