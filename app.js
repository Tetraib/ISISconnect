var express = require("express"),
    fs = require('fs'),
    parser = require('L7'),
    mongoose = require('mongoose'),
    request = require("request"),
    multer = require('multer'),
    bodyParser = require('body-parser'),
    PDFDocument = require('pdfkit'),
    app = express(),
    db = mongoose.connection;
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
    //use to receive the HL7 prescription
    app.post('/postprescriptionhl7', function(req, res) {
        var hl7Message = parser.parse(req.text),
            patientgender,
            borngender,
            doc = new PDFDocument(),
            hl7Json = hl7Message.translate({
                MessageDate:"MSH|7^0",
                SendingAPP: "MSH|3^1",
                SendingFacility: "MSH|4^0",
                PatientID: "PID|3^0",
                PatientFname: "PID|5^1",
                PatientLname: "PID|5^0",
                PatientBname: "PID|6^0",
                PatientDOB: "PID|7^0",
                PatientSex: "PID|8^0",
                PatientStreet: "PID|11^0",
                PatientPostalCode: "PID|11^4",
                PatientCity: "PID|11^2",
                PatientPhone: "PID|13^0",
                Pointofcare: "PV1|3^0",
                PatientRoom: "PV1|3^1",
                Facility: "PV1|3^3",
                PatientVisitNumber: "PV1|19^0",
                PatientAdmitTimeDate: "PV1|44^0",
                DoctorLname: "ORC|12^1",
                DoctorFname: "ORC|12^2",
                DoctorRPPS: "ORC|12^8",
                PrescriptionDateTime: "ORC|15^0",
                PrescriptionText: "ORC|16^1",
                FacilityStreetAdress: "ORC|22^0",
                FacilityCity: "ORC|22^2",
                FacilityPostalCode: "ORC|22^4",
                FacilityPhoneNumber: "ORC|23^0",
                ServicePhoneNumber: "ORC|24^0",
                PrescriptionExam: "OBR|4^1"
            });
console.log(hl7Json);
        if (hl7Json.PatientSex == "M") {
            patientgender = "M.";
            borngender = "Né";
        }
        else if (hl7Json.PatientSex == "F") {
            patientgender = "Mme.";
            borngender = "Née";
        }
        doc.fontSize(14).text(hl7Json.SendingFacility).fontSize(10).text(hl7Json.FacilityStreetAdress).text(hl7Json.FacilityPostalCode + " " + hl7Json.FacilityCity).text(hl7Json.FacilityPhoneNumber).text('————————————————').fontSize(14).text('Dr ' + hl7Json.DoctorFname + " " + hl7Json.DoctorLname).fontSize(10).text('N° RPPS : ' + hl7Json.DoctorRPPS.match(/~([^ ]*)/)[1]).text(hl7Json.ServicePhoneNumber).fontSize(18).text(patientgender + " " + hl7Json.PatientFname + " " + hl7Json.PatientLname, {
            align: 'right'
        }).fontSize(12).text(borngender + ' le ' + hl7Json.PatientDOB, {
            align: 'right'
        }).text(hl7Json.Facility + " - Chambre " + hl7Json.PatientRoom, {
            align: 'right'
        }).text('Séjour n° ' + hl7Json.PatientVisitNumber, {
            align: 'right'
        }).fontSize(10).moveDown().text(hl7Json.PatientStreet, {
            align: 'right'
        }).text(hl7Json.PatientPostalCode + " " + hl7Json.PatientCity, {
            align: 'right'
        }).text(hl7Json.PatientPhone, {
            align: 'right'
        }).moveDown().fontSize(12).text('Le, ' + hl7Json.PrescriptionDateTime).moveDown().fontSize(14).text(hl7Json.PrescriptionExam, {
            align: 'center'
        }).fontSize(12).moveDown().text(hl7Json.PrescriptionText.replace(/\\.br\\/g, "\n")).moveDown(2).fontSize(8).text('Informations issues du logiciel ' + hl7Json.SendingAPP, {
            align: 'center'
        });
        doc.end();
        doc.pipe(fs.createWriteStream('./uploads/'+hl7Json.PatientFname+'_'+hl7Json.PatientLname+'_'+hl7Json.PatientDOB+'_'+hl7Json.MessageDate+'_'+Date.now()+'.pdf'));
        res.send(200);
    });
});