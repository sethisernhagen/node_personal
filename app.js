
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var errorhandler = require('errorhandler');
var morgan = require('morgan');
var favicon = require('serve-favicon');
var yahooFinance = require('yahoo-finance');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')))
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
    app.use(errorhandler());
}

app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/contact', routes.contact);
app.get('/quote', routes.quote);
app.get('/getQuote/:symbol', routes.getQuote);
app.get('/bubbleChart', routes.bubbleChart);


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
