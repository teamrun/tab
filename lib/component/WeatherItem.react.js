var WeatherItem = React.createClass({
    render: function(){
        var data = this.props.data;
        var date = data.date;
        date = date.replace(/\(.+\)/g, '').trim();
        var classes = ['weather-item'];
        if(this.props.extraClass){
            classes.push(this.props.extraClass);
        }
        return (
            <div className={classes.join(' ')}>
                <p className="weather-date">{date}</p>
                <p className="weather-desc">{data.weather}</p>
                <p className="weather-wind">{data.wind}</p>
                <p className="weather-temp">{data.temperature}</p>
            </div>
        );
    }
});

module.exports = WeatherItem;