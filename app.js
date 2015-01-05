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


var server = app.listen(3008, function(){
    var port = server.address().port;
    console.log('app listening at ', port);
});