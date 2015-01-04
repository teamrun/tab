

var app = require('express')();

app.get('/api/ip-add', function(req, res){
    var ip = req.headers['x-forwarded-for'] || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
    res.send('Your ip is: ' + ip + '.\n' + 'Your locaiton is: ' + 'unknow yet'  + '.');
});

var server = app.listen(3008, function(){
    var port = server.address().port;
    console.log('app listening at ', port);
});