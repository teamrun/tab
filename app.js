var path = require('path');
var requireDir = require('require-dir');
var fse = require('fs-extra');

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
var neededFolder = ['jsonPath'];
neededFolder.forEach(function(k){
    fse.mkdirpSync(config[k]);
});


var routes = requireDir('./route-api');

var A_DAY = 24*60*60;

function sendCacheableFile(filePath, res){
    // 手动设置max-age的header
    res.set('cache-control', 'public, max-age='+30*A_DAY);
    res.sendFile(filePath);
}

app.get('/api/ip-add', routes.getAddressByIp.route);
app.get('/api/weather', routes.getWeather.route);
app.get('/api/time', function(req, res){
    var now = new Date();
    var timeStr = (now.getMonth()+1) +'-'+now.getDate()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
    res.send('server current time: ', timeStr);
});

app.get(/\/solid\/.+/, function(req, res){
    var file = req.path;
    file = file.substr('/solid'.length);
    file = path.join(__dirname, file);
    sendCacheableFile(file, res);
});

var server = app.listen(3008, function(){
    var port = server.address().port;
    console.log('app listening at ', port);
});