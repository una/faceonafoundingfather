require('babel-core/register');
require('source-map-support').install();

var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    fs;

var app = express();

if(process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'staging'){
	app.set('port', process.env.VCAP_APP_PORT || 80);
}else{
	app.set('port', 3000);
}

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(require("skipper")());

var softlayerObjStoreCreds = {
    "auth_url": process.env.FOUNDINGFATHER_OBJ_AUTH_URL,
    "userId": process.env.FOUNDINGFATHER_OBJ_UN,
    "password": process.env.FOUNDINGFATHER_OBJ_PW,
    "container": process.env.FOUNDINGFATHER_OBJ_CONTAINER
}

require('./modules/routes/index.js')(app, softlayerObjStoreCreds); // load our routes and pass in our app and fully configured passport
app.use(express.static('public'));
app.listen(app.get('port'), function() {
    var skipperSwift = require("skipper-openstack")();
    skipperSwift.ensureContainerExists(softlayerObjStoreCreds, softlayerObjStoreCreds.container, 1, function (error) {
        if (error) {
            console.log(error);
            console.log("unable to create default container", softlayerObjStoreCreds.container);
        }
        else {
            console.log("ensured default container", softlayerObjStoreCreds.container, "exists");
        }
    });
    console.info('Server listening on port ' + this.address().port);
});