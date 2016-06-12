var request = require('request');
var fs = require('fs');
var mimeTypes = require('mime-types');
var crypto = require('crypto');
var pkgcloud = require("pkgcloud");

/*
	TODO: set request URL automatically from token request
*/

module.exports = {

	createObject: function(credentials, req, res){
		crypto.pseudoRandomBytes(16, function (err, raw) {
			//MAKE SURE THAT YOU SEND THE IMAGE AS IMAGE NOT WIREFRAME
			var filename = raw.toString('hex') + '.' + mimeTypes.extension(req.file('image')._files[0].stream.headers['content-type']);
			req.file('image')._files[0].stream.filename = filename;
			req.file('image').upload({
				adapter: require('skipper-openstack'),
				credentials: credentials,
				container: credentials.container,
				version: 1
			},function(err, uploadedFiles){
				if(err){
					console.log(err);
					return res.json({
						success: false,
						error: err
					});
				}else{
					res.json({
						success: true,
						path: '33ed3.http.dal05.cdn.softlayer.net/'+credentials.container+'/'+uploadedFiles[0].filename
					});
				}
			});
		});
	}
}