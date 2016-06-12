module.exports = function(app, softlayerObjStoreCredentials) {
    var path = require('path');
    var __dirname = path.resolve(path.dirname());
    var objStorage = require('../objectStorage/index.js');

    // route for home page
    // app.get('/', function(req, res){
    //     res.static('index.html');
    // });

    // app.get('/test', function(req, res){
    //     res.static('index.html');
    // });

    app.post('/upload', function(req, res){
        objStorage.createObject(softlayerObjStoreCredentials,req,res);
    });

    app.post('/convert', function(req,res){
        converter.toPDF(req,res);
    });

};