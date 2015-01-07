function makeDouble(n){
    if(n>=10){
        return String(n);
    }
    else{
        return '0' + n;
    }
}

function getNewClock(){
    var d = new Date();
    return {
        M: makeDouble(d.getMonth()+1),
        D: makeDouble(d.getDate()),
        h: makeDouble(d.getHours()),
        m: makeDouble(d.getMinutes())
    };
}
function getGreetWords(){
    var now = new Date();
    var Hour = now.getHours();
    if(Hour < 12){
        return 'Good morning';
    }
    if( Hour >= 12 && Hour < 18){
        return 'Good afternoon';
    }
    else{
        return 'Good evening';
    }
}

var Sample = React.createClass({
    getInitialState: function() {
        return {
            M: '00',
            D: '00',
            h: '00',
            m: '00',
            greeting: ''
        };
    },
    componentDidMount: function() {
        this.setState(getNewClock());
        this.updateClock();

        this.setState({
            greeting: getGreetWords()
        });
        this.updateGreet();
    },
    render: function(){
        var s = this.state;
        return (
            <div className="greet">
                <h3 className="greet-words">{this.state.greeting}, 
                    <span className="user-name">{this.props.name}</span>
                </h3>
                <p className="time-text">Now is</p>
                <div className="clock">
                    <p  className="g-value g-hour">{s.h}</p>
                    <p  className="g-value g-minute">{s.m}</p>
                </div>
                <p className="today-text">Today is</p>
                <div className="cal">
                    <h2 className="g-value g-month">{s.M}</h2>
                    <h2 className="g-value g-date">{s.D}</h2>
                </div>
            </div>
        );
    },
    updateClock: function(){
        var self = this;
        setTimeout(function(){
            self.setState(getNewClock());
            self.updateClock();
        }, 1000);
    },
    updateGreet: function(){
        setTimeout(function(){
            this.setState({
                greeting: getGreetWords()
            });
            this.updateGreet();
        }.bind(this), 5*60*1000);
    }
});
// var Sample = {};

module.exports = Sample;
