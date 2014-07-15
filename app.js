var express = require("express"),
    app = express(),
    mongoose = require('mongoose'),
    db = mongoose.connection,
    request = require("request"),
    multer = require('multer'),
    bodyParser = require('body-parser');

//Use for upload file
app.use(multer({
    dest: './uploads/'
}));
//use for parsing body data
app.use(bodyParser.urlencoded({
    extended: true
}));
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



//Start Mongoose
mongoose.connect(process.env.MONGOCON);
//DB open function
db.on('error', console.error.bind(console, 'mongodb connection error:'));
db.once('open', function callback() {
    //use to get the hl7 from mirth
    app.post('/posthl7', function(req, res) {
        console.log(req.text);
        res.send(200);
    });
    //use to post the file in body and the patient info in the header and forward it to mirth
    app.post('/postcr', function(req, res) {
        // console.log(req.files);
        // Forward to mirth
        console.log(req.headers.exam_infos);

        request.post({
            url: 'http://146.148.3.248:80/crtxt/',
            body: req.headers.exam_infos,
            headers: {
                'Content-Type': 'text/plain'
            }
        }, function (error, response, body) {
    //HERE code to manage post errors
    });
        res.send(200);
    });
    
    app.get('/hello', function(req, res) {
        //set the download name
        res.setHeader('Content-disposition', 'attachment; filename=dramaticpenguin.txt');
        // Send the datas ad a file
        
    });
    
    //use to receive the HL7 prescription and forward it to mirth
    app.post('/postprescriptionhl7', function(req, res) {
        //forward to mirth
        request.post({
            url: 'http://146.148.3.248:81/prescription/',
            body: req.text,
            headers: {
                'Content-Type': 'text/plain; charset=UTF-8'
            }
        });
        res.send(200);
        
    });
    //used to receive the TXT prescription from mirth
    app.post('/postprescriptiontxt', function(req, res) {
        console.log(req.text);
        res.send(200);
    });
});