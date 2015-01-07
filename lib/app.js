var util = require('../util');

var AskInput = require('./component/AskInput.react');

var Google = require('./component/Google.react');
var Greet = require('./component/Greet.react');
var Weather = require('./component/Weather.react');

var LS = window.localStorage;

// localStorage get & set
// now only support string;
function lsgs(key){
    return {
        get: function(){
            return LS[key];
        },
        set: function(data){
            LS[key] = data;
        }
    }
}

var AppData = {
    name: lsgs('name'),
    city: lsgs('city')
};

function notEmpty(str){
    return !!str;
}

function getLocation(callback){
    // test data
    var param = {ip: '122.224.68.242'};
    util.getJSON('/api/ip-add', param, function(data, status){

    // util.getJSON('/api/ip-add', function(data, status){
        if(status == 'success' && data.code == 200){
            callback(data.data);
        }
        else{
            console.log('无法通过ip获取您的位置');
        }
    });
}

var App = React.createClass({
    getInitialState: function() {
        return {
            name: false,
            city: false
        };
    },
    componentDidMount: function() {
        var newState = {};
        var name = AppData.name.get();
        var city = AppData.city.get();
        if(name){
            newState.name = name;
        }
        if(city){
            newState.city = city;
        }
        else{
            getLocation(function(data){
                this.setState({
                    gotCity: data.city.replace('市', '')
                });
            }.bind(this));
        }
        if( !util.isEmptyObj( newState )){
            this.setState(newState);
        }
    },
    render: function(){
        if(!this.state.name){
            return <AskInput ask="Please tell me your name:" validate={notEmpty} callback={this.saveName} />
        }
        if(!this.state.city){
            if( this.state.gotCity ){
                return <AskInput ask="Is this your current location(city)?" defaultVal={this.state.gotCity} validate={notEmpty} callback={this.saveCity} />
            }
            else{
                return <AskInput ask="Please tell me your location(city)" defaultVal={''} validate={notEmpty} callback={this.saveCity} />;
            }
            
        }

        return (
            <div>
                <Google />
                <Greet name={this.state.name}/>
                <Weather city={this.state.city}/>
            </div>
        );
    },
    saveName: function(name){
        this.setState({
            name: name
        });
        AppData.name.set(name);
    },
    saveCity: function(city){
        this.setState({
            city: city
        });
        AppData.city.set(city);
    }
});


React.render(<App />, document.querySelector('#ctn'));