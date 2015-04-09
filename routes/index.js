var yahooFinance = require('yahoo-finance');
/*
 * GET home page.
 */


exports.index = function (req, res) {
    res.render('index', { title: 'Home', year: new Date().getFullYear() });
};

exports.about = function (req, res) {
    res.render('about', { title: 'About', year: new Date().getFullYear() });
};

exports.contact = function (req, res) {
    res.render('contact', { title: 'Contact', year: new Date().getFullYear() });
};

exports.quote = function (req, res) {
    res.render('quote', { title: 'Stock Quote Charts', year: new Date().getFullYear() });
};

exports.bubbleChart = function (req, res) {
    res.render('bubble_chart', { title: 'D3.js Bubble Chart with Zoom', year: new Date().getFullYear() });
};

exports.getQuote = function (req, res) {
    

    get_quote(req, function (err, quotes) {
        if (err != null) {
            res.writeHead(503, { 'Content-Type' : 'application/json' });
            res.end(JSON.stringify({ error: 'file_error', message: err.message }) + '\n');
            return;
        }
        
        res.writeHead(200, { 'Content-Type' : 'application/json' });
        res.end(JSON.stringify({ error: null, data: { quotes: quotes } }) + '\n');
    });

};



function get_quote(req, callback) {
     
    var endDate = new Date();


    yahooFinance.historical({
        symbol: req.params.symbol,
        from: '2010-01-01',
        to: endDate.toDateString(),
  // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only) 
    }, function (err, quotes) {
        if (err) {
            callback(err);
            return;
        }
        else
            callback(null, quotes);
            return;
    });
}
