var express = require("express"),
    app = express(),
    mongoose = require('mongoose'),
    db = mongoose.connection,
    request = require("request"),
    multer = require('multer'),
    bodyParser = require('body-parser'),
    PDFDocument = require('pdfkit');
    
//Use for upload file
app.use(multer({
    dest: './uploads/'
}));
//use for parsing body data
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


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
        console.log(req.body);
        // Need to escape " in mirth in case
        res.send(200);
    });
});


// create PDF a document
var doc = new PDFDocument();
//
doc.fontSize(14)
.text('Interface')
.fontSize(10)
.text('195 rue Adolphe Defrenne')
.text('59160 LOMME')
.text('08 26 30 07 00')
.text('————————————————')
.fontSize(14)
.text('Dr George DELEPORTE')
.fontSize(10)
.text('N° RPPS : 10003796462')
.fontSize(18)
.text('M. Paul VALLET', { align: 'right'})
.fontSize(12)
.text('Né(e) le 05/05/1929', {align: 'right'})
.text('Etage 2 - Chambre 211', { align: 'right'})
.text('Séjour n° 56941', { align: 'right'})
.fontSize(10)
.moveDown()
.text('11 RUE D ARTOIR', { align: 'right'})
.text('59320 EMMERIN', { align: 'right'})
.text('03 20 07 97 49', { align: 'right'})
.moveDown(2)
.fontSize(12)
.text('Le 13/06/2014,')
.moveDown()
.fontSize(22)
.text('ECHOGRAPHIE des voies urinaires', { align: 'center'})
.fontSize(12)
.moveDown()
.text('INCIDENCES PARTICULIERES :')
.text('-')
.text('-')
.text('-')
.moveDown()
.text('INDICATION : retention urinaire désondée.Bilan à la demande du Dr BALLEREAU')
.text('-')
.text('-')
.text('-')
.moveDown()
.text('ANTECEDENTS UTILES : CPIschemique sévére avec FEVG abaissée.')
.text('-')
.text('-')
.text('-')
.moveDown()
.text('CIRCONSTANCES PARTICULIERES : ')
.text('-')
.text('-')
.text('-')
.moveDown(2)
.fontSize(8)
.text('Informations issues du logiciel Osiris', { align: 'center'});
//

doc.end();