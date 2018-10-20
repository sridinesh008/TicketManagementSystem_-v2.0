var express = require('express');
var app = express();
var port = process.env.PORT || 9091;
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router();
var appRoutes = require('./app/route/api')(router);
var appRoutes1 = require('./app/route/issueAPI')(router);
var appRoutes2 = require('./app/route/commentApi')(router);
var appRoutes3 = require('./app/route/resolutionApi')(router);
var path = require('path');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));
app.use('/api',appRoutes);
app.use('/api',appRoutes1);
app.use('/api',appRoutes2);
app.use('/api',appRoutes3);


app.listen(port, function(){
    console.log("running the server"+port)
});


app.get('*',function (req,res) {
    res.sendFile(path.join(__dirname+'/public/app/views/index.html'))
});

mongoose.connect('mongodb://localhost:27017/TicketManagementDB',function (err) {
    if(err){
        console.log("Error while connecting to DB --->"+ err)
    }else{
        console.log("Connnection Established Successfully...")
    }
});




