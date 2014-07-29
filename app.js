var express = require("express"),
    app = express(),
    mongoose = require('mongoose'),
    db = mongoose.connection,
    request = require("request"),
    multer = require('multer'),
    bodyParser = require('body-parser'),
    PDFDocument = require('pdfkit'),
    fs = require('fs'),
    parser = require('L7');

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
app.listen(process.env.PORT, process.env.IP);

//Start Mongoose
mongoose.connect(process.env.MONGOCON);
//DB open function
db.on('error', console.error.bind(console, 'mongodb connection error:'));
db.once('open', function callback() {
    console.log("DB Open");
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
        }, function(error, response, body) {
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
        console.log(req.text);
       var message = parser.parse(req.text);
console.log(message.query('PID|5[0]'));
console.log(message.query('PID|5[1]'));
        res.send(200);
    });
    //used to receive the TXT prescription from mirth
    app.post('/postprescriptiontxt', function(req, res) {
        console.log(req.body);
        // Need to escape " in mirth in case
        res.send(200);
        // create PDF a document
        var patientgender,
        borngender;
        if (req.body.PatientSex == "M") {
            patientgender = "M.";
            borngender = "Né";
        }
        else if (req.body.PatientSex == "F") {
            patientgender = "Mme.";
            borngender = "Née";
        }
        var doc = new PDFDocument();
        
        doc.fontSize(14).text(req.body.SendingFacility).fontSize(10).text(req.body.FacilityStreetAdress).text(req.body.FacilityPostalCode + " " + req.body.FacilityCity).text(req.body.FacilityPhoneNumber).text('————————————————').fontSize(14).text('Dr ' + req.body.DoctorFname + " " + req.body.DoctorLname).fontSize(10).text('N° RPPS : ' + req.body.DoctorRPPS).fontSize(18).text(patientgender + " " + req.body.PatientFname + " " + req.body.PatientLname, {
            align: 'right'
        }).fontSize(12).text(borngender+' le ' + req.body.PatientDOB, {
            align: 'right'
        }).text(req.body.Facility + " - Chambre " + req.body.PatientRoom, {
            align: 'right'
        }).text('Séjour n° ' + req.body.PatientVisitNumber, {
            align: 'right'
        }).fontSize(10).moveDown().text(req.body.PatientStreet, {
            align: 'right'
        }).text(req.body.PatientPostalCode + " " + req.body.PatientCity, {
            align: 'right'
        }).text(req.body.PatientPhone, {
            align: 'right'
        }).moveDown(2).fontSize(12).text('Le, ' + req.body.PrescriptionDateTime).moveDown().fontSize(12).moveDown().text(req.body.PrescriptionText).moveDown(2).fontSize(8).text('Informations issues du logiciel ' + req.body.SendingAPP, {
            align: 'center'
        });
        doc.end();
        doc.pipe(fs.createWriteStream('./uploads/file.pdf'));

    });
});
