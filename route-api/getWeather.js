

// requireDir是在项目的根目录初始化的 所以基础路径是项目根目录
var API = requireDir('./api');

module.exports = {
    route: function(req, res){
        var city = req.query.city;
        var code = req.query.code;
        if(city || code){
            API.getWeather.all(city||code, function(err, seven, realtime){
                if(!err){
                    res.send({
                        code: 200,
                        data: {
                            seven: seven,
                            realtime: realtime
                        }
                    });
                }
                else{
                    res.send({
                        code: 500,
                        err: err
                    });
                }
            });
        }
        else{
            res.send('gonna get location by ip and then get weather');
        }
    }
}