var request = require('request');


var TB_IP_LIB = 'http://ip.taobao.com/service/getIpInfo.php';

function getAddByIp(ip, callback){
    request(TB_IP_LIB + '?ip=' + ip, function(err, res, body){
        if(err == null ){
            var sc = res.statusCode;
            if(sc == 200){
                var data = JSON.parse(body);
                if(data.code === 0){
                    callback(null, data.data);
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
