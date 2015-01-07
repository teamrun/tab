var AskInput = React.createClass({
    getInitialState: function() {
        return {
            val: ''
        };
    },
    componentDidMount: function() {
        this.input = this.refs['ai-input'].getDOMNode();
        this.setState({
            val: this.props.defaultVal || ''
        })
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState({
            val: nextProps.defaultVal || ''
        })
    },
    render: function() {
        return (
            <div className="ask-input">
                <h3 className="ai-ask">{this.props.ask}</h3>
                <input className="ai-input" type="text" ref="ai-input" value={this.state.val} onChange={this._changeVal} onKeyDown={this._keyDown} />
            </div>
        );
    },
    _keyDown: function(e){
        var val = this.input.value;
        if(e.keyCode == 13){
            if( this.props.validate(val) ){
                this.props.callback(val);
            }
        }
    },
    _changeVal: function(){
        var val = this.input.value;
        this.setState({val: val});
    }

});

module.exports = AskInput;