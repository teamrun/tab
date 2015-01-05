

// requireDir是在项目的根目录初始化的 所以基础路径是项目根目录
var API = requireDir('./api');

// helper for two calls: have city; no city and get by ip
function sendAllWeatherData(res, err, seven, realtime, extraData){
    resData = extraData || {};
    if(!err){
        resData.seven = seven;
        resData.realtime = realtime;
        res.send({
            code: 200,
            data: resData
        });
    }
    else{
        res.send({
            code: 500,
            err: err.message
        });
    }
}

module.exports = {
    route: function(req, res){
        var city = req.query.city;
        var code = req.query.code;
        if(city || code){
            API.getWeather.all(city||code, function(err, seven, realtime){
                sendAllWeatherData(res, err, seven, realtime);
            });
        }
        // 没有传city
        else{
            // res.send('gonna get location by ip and then get weather');
            var ip = req.ip;
            if(ip === '127.0.0.1'){
                ip = req.header('X-real-ip');
            }
            API.getAddress(ip, function(err, data){
                if(err){
                    res.send({
                        code: 500,
                        err: err.message
                    });
                }
                else{
                    city = data.city;
                    API.getWeather.all(city, function(err, seven, realtime){
                        sendAllWeatherData(res, err, seven, realtime, {city: city});
                    });
                } 
            });
        }
    }
}