if (process.env.C9_PROJECT) {
    require('./private.js');
}
var express = require("express"),
    app = express()

app.configure(function() {
    app.use(express.static(__dirname + '/public'));
 
});
app.listen(process.env.PORT, process.env.IP);
//
app.get('/', function(req, res) {

});