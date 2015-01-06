module.exports = {
    getJSON: function(url, param, callback){
        var xhr = new XMLHttpRequest();
        xhr.onload = function(e){
            if( xhr.status == 200){
                var data = JSON.parse(xhr.response);
                callback(data, 'success' );
            }
            else{
                callback(data, 'fail');
            }
        };
        // 
        var query = '';
        if(url.indexOf('?')>=0){
            query += '&'
        }
        else{
            query += '?';
        }
        var arr = [];
        for(var i in param){
            arr.push( i +'='+param[i] );
        }
        query += arr.join('&');
        xhr.open("get", url+query, true);
        xhr.send();
    }
}