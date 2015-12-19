var express = require('express');
var router = express.Router();
var fs = require('fs');
var mc = require('mc');
var format = require('string-template');
var https = require('https');
var http = require('http');

function makeHtmlContent(name, jscontent) {
	var template = fs.readFileSync('./public/js-templates/instagram-api.js').toString();
	var picture = JSON.parse(jscontent).entry_data.ProfilePage[0].user.media.nodes[0].display_src;
	langs += '<div class="duolingo"><img src="http://api.it-the-drote.tk/static/img/countryballs/' +
	innerHtml = {
		htmlcontent: '<div class="instagram"><h1>Instagram: ' +
		name + '</h1></div><div class="instagram"><img class="instagram-pic" src="' +
		picture + '"></img></div>'
	};
	return(format(template, innerHtml));
}

router.get('/instagram/lastphoto/:login', function(request, response) {
	var memcache = new mc.Client();
	memcache.connect(function() {
		memcache.get("instagram-info-" + request.params.login,
			function(err, memcacheResponse) {
				if(err && err.type == 'NOT_FOUND') {
					https.get('https://www.instagram.com/' + request.params.login,
						function(res) {
							var html = '';
							res.on('data', function(chunk){
								html += chunk;
							});
							res.on('end', function() {
								var re = /<script type="text\/javascript">window\._sharedData.*<\/script>/;
								var rawData = html.match(re);
								re = /\{.*\}/;
								var jsonData = rawData[0].match(re);
								memcache.set("instagram-info-" + request.params.login,
									jsonData,
									{flags: 0, exptime: 300},
									function(err, status) {
										console.log(status);
										console.log(err);
									});
								response.setHeader("Content-Type", "application/javascript");
								response.send(makeHtmlContent(request.params.login,
									jsonData));
							});
						});
				} else {
					response.setHeader("Content-Type", "application/javascript");
					response.send(makeHtmlContent(request.params.login,
						memcacheResponse['instagram-info-' + request.params.login]));
				}
			});
	});
});
