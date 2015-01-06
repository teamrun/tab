var request = require('request');
var requireDir = require('require-dir');

var app = require('express')();
var config = require('./config');

global.requireDir = requireDir;
global.config = config;

if(require.resolve('./localConfig')){
    var localConfig = require('./localConfig');
    for(var i in localConfig){
        config[i] = localConfig[i];
    }
}


var routes = requireDir('./route-api');


app.get('/api/ip-add', routes.getAddressByIp.route);
app.get('/api/weather', routes.getWeather.route);
app.get('/api/time', function(req, res){
    var now = new Date();
    var timeStr = (now.getMonth()+1) +'-'+now.getDate()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
    res.send('server current time: ', timeStr);
});


var server = app.listen(3008, function(){
    var port = server.address().port;
    console.log('app listening at ', port);
});