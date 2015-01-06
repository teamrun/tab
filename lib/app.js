var React = require('react');

var Greet = require('./component/Greet.react');
var Weather = require('./component/Weather.react');

var App = React.createClass({
    getInitialState: function() {
        return {
            name: 'chenllos',
            city: '杭州'
        };
    },
    componentDidMount: function() {
        
    },
    render: function(){
        return (
            <div>
                <Greet name={this.state.name}/>
                <Weather city={this.state.city}/>
            </div>
        );
    }
});


React.render(<App />, document.querySelector('#ctn'));