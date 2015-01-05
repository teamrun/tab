var React = require('react');

var config = {
    seven: 'http://m.weather.com.cn/data/{{city}}.html',
    today: 'http://www.weather.com.cn/data/cityinfo/{{city}}.html',
    realTime: 'http://www.weather.com.cn/data/sk/{{city}}.html'
};

var LS = window.localstorage;

var GetWeather = React.createClass({
    componentDidMount: function() {
        
    },
    render: function() {
        // iframe跨域了... DOMException 18, 不允许访问
        return (
            <div id="iframe-ctn-for-getweather">
                <iframe name="iframe-weather-seven" src={}></iframe>
                <iframe name="iframe-weather-today" src={}></iframe>
                <iframe name="iframe-weather-realtime" src={}></iframe>
            </div>
        );
    }
});

module.exports = GetWeather;