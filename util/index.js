module.exports = {
    getJSON: function(url, param, callback){
        if(param instanceof Function ){
            callback = param;
            param = undefined;
        }

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
        if( param ){
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
        }
        
        xhr.open("get", url+query, true);
        xhr.send();
    },
    makeDouble: function(n){
        if(n<10){
            return '0'+n;
        }
        else{
            return String(n);
        }
    },
    isEmptyObj: function(obj){
        for(var i in obj){
            return false;
        }
        return true;
    }
}