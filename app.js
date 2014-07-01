var express = require("express"),
    app = express(),
    mongoose = require('mongoose'),
    db = mongoose.connection;
app.use(express.urlencoded());
app.use(express.json());

//add support for text/plain
app.use(function(req, res, next) {

    if (req.is('text/*')) {
        req.text = '';
        req.setEncoding('utf8');
        req.on('data', function(chunk) {
            req.text += chunk;
        });
        req.on('end', next);
    }
    else {
        next();
    }
});
process.env.MONGOCON = "mongodb://cloud9:ZSTqSa04E7Lp3ao@kahana.mongohq.com:10005/app26722556";
app.listen(process.env.PORT, process.env.IP);
var testdata;
//Start Mongoose
mongoose.connect(process.env.MONGOCON);
//DB open function
db.on('error', console.error.bind(console, 'mongodb connection error:'));
db.once('open', function callback() {
    app.post('/', function(req, res) {
        console.log(req.text);
        testdata=req.text;
        res.send(200);
    });
    app.get('/hello', function(req, res) {
        //set the download name
        res.setHeader('Content-disposition', 'attachment; filename=dramaticpenguin.txt');
        //Send the datas ad a file
        res.send(testdata);
    });
});