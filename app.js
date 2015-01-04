var request = require('request');
var requireDir = require('require-dir');

var API = requireDir('./api');

var app = require('express')();


app.get('/api/ip-add', function(req, res){
    var ip = req.ip;
    // nginx反向代理后 原来的ip字段都被设为了本机
    // 在nginx反代配置中增加一条配置
    // location /api {
    //     proxy_pass http://localhost:3008;
    //     proxy_set_header  X-real-ip $remote_addr;
    // }
    if(ip == '127.0.0.1'){
        ip = req.header('X-real-ip');
    }
    API.getAddress(ip, function(err, data){
        if(err){
            var extra = JSON.stringify(req.header('X-real-ip'));
            res.send( extra +'\n'+ err.toString());
        }
        else{
            var locationStr = data.country + ' ' + data.region + ' ' + data.city;
            res.send('Got your address through your ip('+ip+'): ' +  locationStr);
        }
    });
});


var server = app.listen(3008, function(){
    var port = server.address().port;
    console.log('app listening at ', port);
});