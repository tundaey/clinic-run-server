var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var socketioJwt = require('socketio-jwt');

var app = express();
var http = require('http');

var apiRoutes = require('./server/routes/api')(app, express);
//var adminRoutes = require('./app/routes/admin')(app, express);
//var parnerRoutes = require('./app/routes/partners')(app, express);

var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } } };

mongoose.connect(config.db_local_url, options);
//mongoose.connect(config.db_local_url);
mongoose.connection.on('error', function(){
    console.error('MongoDb Connection Error, Ensure mongodb instance is running');
});

mongoose.connection.on('success', function(){
    console.log('MongoDb has connected!');
})
var socketio = require('socket.io');
var server = http.createServer(app);
var io  = socketio.listen(server);
require('./server/socket/socket')(io);

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization,x-access-token');
    //next();
    if ('OPTIONS' == req.method) {
        res.status(200).send("OK");
    }
    else {
        next();
    }
});


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'app')));


app.get('/', function(req, res, next){
    res.render(path.join(__dirname + '/app/index.html'));
});



app.use('/api', apiRoutes);
//app.use('/admin', adminRoutes);
//app.use('/partners', parnerRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
app.use(function(err, req, res, next) {
    res.status(err.status || 500).send({message: err.message, error: err});
});
//}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500).send({message: err.message, error: err});
});

server.listen(config.port, function(){
    console.log('E-clinic is running on port '+ config.port);
});
