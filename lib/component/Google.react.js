var Google = React.createClass({

    render: function() {
        return (
            <input type="text" autofocus="true" id="google-search" placeholder="key word or url" onKeyDown={this._keydone}/>
        );
    },
    _keydone: function(e){
        if(e.keyCode == 13){
            var input = this.value;
            if( likeUrl(input) ){
                var urlObj = parseUrl(input);
                window.location.href= (urlObj.protocol || 'http:')  +'//' + input;
            }
            else{
                window.location.href= 'https://www.google.com/search?q=' + this.value;
            }
        }
    }
});

    
function likeUrl(input){
    if(input.indexOf('.') >0 ){
        return true;
    }
    return false;
}
function parseUrl(url){
    var a = document.createElement('a');
    a.href = 'url';
    var res = {};
    ["origin", "hash", "search", "pathname", "port", "hostname", "host", "protocol", "href"].forEach(function(k){
        res[k] = a[k];
    });
    return res;
}


module.exports = Google;