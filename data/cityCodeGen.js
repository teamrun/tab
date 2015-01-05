var fs = require('fs');

var file = './city-code.txt';

var CITY_CODE_REG = /([\u4e00-\u9fa5]+)\:([0-9]{9})/ig;

fs.readFile(file, function(err, data){
    if(err){
        console.log(err);
    }
    else{
        var str = data.toString();
        var city_code_pairs = str.match(CITY_CODE_REG);
        // console.log(city_code_pairs);

        var jsonStr = '{\n';
        city_code_pairs.forEach(function(p, i){
            var arr = p.split(':');
            jsonStr += '    ';
            // key
            jsonStr += '"' + arr[0] + '"' + ': ';
            // val
            jsonStr += '"' + arr[1] + '"';
            // ,
            if( city_code_pairs[i+1] ){
                jsonStr += ',';
            }
            jsonStr += '\n';
        });
        jsonStr += '}';

        fs.writeFile('./cityCode.json', jsonStr, function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log('done!');
                console.log('wrote ' +city_code_pairs.length+ ' city-codes!');

                var json = require('./cityCode.json');
                console.log(json);
            }
        });
    }
});