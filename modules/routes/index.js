module.exports = function(app, softlayerObjStoreCredentials) {
    var path = require('path');
    var __dirname = path.resolve(path.dirname());
    var objStorage = require('../objectStorage/index.js');
    console.log(__dirname);

    app.post('/upload', function(req, res){
        objStorage.createObject(softlayerObjStoreCredentials,req,res);
    });

    app.post('/convert', function(req,res){
        converter.toPDF(req,res);
    });

    app.get('/founder/*', function(req, res){
        res.sendFile(__dirname + '/public/index.html');
    });

};