var assign = require('react/lib/Object.assign');

var util = require('../../util');
var makeDouble = util.makeDouble;

var WeatherItem = require('./WeatherItem.react');

var url = {
    weatherAll: '/api/weather',
    weatherRealtime: '/api/weather/realtime'
};

var LC = window.localStorage;


var forecastCache = {
    get: function(){
        if(LC.forecast){
            var cachedDataStr = LC.forecast;
            var cachedData = JSON.parse(cachedDataStr);
            var t = new Date();
            var todayStr = t.getFullYear() +'-'+makeDouble(t.getMonth()+1)+'-'+makeDouble(t.getDate());
            if(cachedData.date == todayStr){
                return {
                    data: cachedData,
                    outdate: false
                };
            }
            else{
                return {
                    data: cachedData,
                    outdate: true
                };
            }
        }
        return {
            data: null
        };
    },
    set: function(data){
        LC.forecast = JSON.stringify(data);
    }
};

function getAllWeather(city, callback){
    var cache = forecastCache.get();
    // 有缓存
    if( cache.data !== null ){
        // 未过期
        if(cache.outdate == false){
            callback(cache.data)
            return false;
        }
        // 已过期
        else{
            callback(cache.data)
        }
    }

    util.getJSON(url.weatherAll, {city: city}, function(data, status){
        if(status =='success' && data.code == 200){
            // 检查数据
            if(data.data.forecast.error == 0 && data.data.realtime){
                callback(data.data.forecast);
                forecastCache.set(data.data.forecast);
                return;
            }
        }
        console.log('got all weather failed');
    });
}
function getRealtimeWeather(city, callback){
    util.getJSON(url.weatherRealtime, {city: city}, function(data, status){
        if(status =='success' && data.code == 200){
            callback(data.data);
        }
        else{
            console.log('got all weather failed');
        }
    });
}

function getForecastState(forecast){
    // 四天的数据
    var wd = forecast.results[0].weather_data;
    return {
        forecast: wd
    };
}
function getRealtimeState(realtime){
    return {
        realtime: realtime
    };
}

//var WEEK = {'mon', 'tus', 'wes', 'tur', 'fri', 'sat', 'sun'};



var Weather = React.createClass({
    getInitialState: function() {
        return {
            weatherGot: false,
            curActive: 0
        };
    },
    componentDidMount: function() {
        getAllWeather(this.props.city, function(forecast){
            var newState = assign({
                weatherGot: true 
            }, getForecastState(forecast) 
            // getRealtimeState(weatherData.realtime)
            );

            this.setState(newState);
        }.bind(this));
    },
    render: function() {
        var content;
        if( this.state.weatherGot == false ){
            content = <span>正在获取天气数据...</span>;
        }
        else{
            var wis = this.state.forecast.map(function(w, i){
                return <WeatherItem data={w} key={w.date} extraClass={(i==this.state.curActive)?'active':''} />;
            }.bind(this));
            var switcher = [];
            if(this.state.curActive == 0){
                switcher.push(<span className="switcher pre disabled" onClick={this._switch} />);
            }
            else{
                switcher.push(<span className="switcher pre"  onClick={this._switch} />);
            }
            if( this.state.curActive == this.state.forecast.length - 1 ){
                switcher.push(<span className="switcher next disabled"  onClick={this._switch} />);
            }
            else{
                switcher.push(<span className="switcher next"  onClick={this._switch} />);
            }

            content = [switcher, wis];

        }
        return (
            <div className="weather">
                <div className="noise-layer" />
                {content}
            </div>
        );
    },
    _switch: function(e){
        var ele = e.target;
        var classes = ele.classList;
        if(classes.contains('disabled')){

        }
        else{
            if(classes.contains('pre')){
                this.setState({
                    curActive: this.state.curActive-1
                });
            }
            else if(classes.contains('next')){
                this.setState({
                    curActive: this.state.curActive+1
                });
            }
        }
    }

});

module.exports = Weather;