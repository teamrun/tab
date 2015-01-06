var fs = require('fs')

/*
 * 将对象数据(obj, arr) 写到文件
 * 用JSON.stringify进行prettify
 */
module.exports = function(data, file){
    // JSON.stringify(data, null, 4)
    fs.writeFile(file, JSON.stringify(data, null, 4), function(err){
        if(err){
            console.log('err when persist data: ', err);
        }
        else{
            console.log('persist done~ : ', file);
        }
    });
}