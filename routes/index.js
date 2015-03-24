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
     
    var myQuote;
    
    yahooFinance.historical({
        symbol: req.params.symbol,
        from: '2012-01-01',
        to: '2012-12-31',
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
