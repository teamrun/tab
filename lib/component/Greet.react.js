var React = require('react');

function makeDouble(n){
    if(n>=10){
        return String(n);
    }
    else{
        return '0' + n;
    }
}

function getNewState(){
    var d = new Date();
    return {
        M: makeDouble(d.getMonth()+1),
        D: makeDouble(d.getDate()),
        h: makeDouble(d.getHours()),
        m: makeDouble(d.getMinutes()),
        s: makeDouble(d.getSeconds())
    };
}

var Sample = React.createClass({
    getInitialState: function() {
        return {
            M: '00',
            D: '00',
            h: '00',
            m: '00',
            s: '00'
        };
    },
    componentDidMount: function() {
        this.setState(getNewState());
        this.updateClock();
    },
    render: function(){
        var s = this.state;
        return (
            <div className="greet">
                <p className="today-text">Today is</p>
                <div className="cal">
                    <h2 className="g-value g-month">{s.M}</h2>
                    <h2 className="g-value g-date">{s.D}</h2>
                </div>
                <p className="time-text">Now is</p>
                <div className="clock">
                    <p  className="g-value g-hour">{s.h}</p>
                    <p  className="g-value g-minute">{s.m}</p>
                    <p  className="g-value g-second">{s.s}</p>
                </div>
            </div>
        );
    },
    updateClock: function(){
        var self = this;
        setTimeout(function(){
            self.setState(getNewState());
            self.updateClock();
        }, 1000);
    }
});
// var Sample = {};

module.exports = Sample;
