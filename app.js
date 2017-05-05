var request = require('request');
var express = require('express');
var cfenv = require('cfenv');
var url = require('url');
var watson = require('watson-developer-cloud');
var Cloudant = require('cloudant');



// create a new express server cambio
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
// Texto prueba
var appEnv = cfenv.getAppEnv();

app.get('/traduciraingles', function(req, res){
  var appEnv = cfenv.getAppEnv();
	var appService = appEnv.getService("Language Translator-4v");

	var url = appService.credentials.url;
	var username = appService.credentials.username;
	var password = appService.credentials.password;

  var traduccioningles = watson.language_translator({
    username: username,
    password: password,
    version: 'v2'
  });
  traduccioningles.translate({
    text: req.texto,
    source: 'es',
    target: 'en',
    model: 'es-en'
  }, function(err, translation){
    if(err){
      console.log(err);
    } else {
      console.log(translation);
    }
  });



});

app.get('/analisissentimiento', function(req, res){
  var appEnv = cfenv.getAppEnv();
	var appService = appEnv.getService("Tone Analyzer-c1");

	var url = appService.credentials.url;
	var username = appService.credentials.username;
	var password = appService.credentials.password;

  var analisistono = watson.tone_analyzer({
    username: username,
    password: password,
    version: 'v3',
    version_date: '2016-05-19'
  });

  resultado = analisistono.tone({
    text: req.texto
  });
  console.log(resultado);
});

app.get('/voz', function(req, res, next){
	var appEnv = cfenv.getAppEnv();
	var appService = appEnv.getService("Texto a voz-ut");

	var url = appService.credentials.url;
	var username = appService.credentials.username;
	var password = appService.credentials.password;

	var texttospeech = watson.text_to_speech({
		version:'v1',
		username: username,
		password: password
	});

	console.log("Dentro de voz");
	console.log(req.query);
	var transcript = texttospeech.synthesize({text:req.query.texto, voice:"es-ES_EnriqueVoice", accept:"audio/wav"});

	transcript.on('response', function(response) {
		    if (req.query.download) {
					response.headers['Access-Control-Allow-Origin'] = '*';
		      response.headers['content-disposition'] = 'attachment; filename=audio.wav';

		    }
		  });
		  transcript.on('error', function(error) {
			  next(error);
		  });
			res.setHeader("Access-Control-Allow-Origin", "*");
		  transcript.pipe(res);
});


// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);


});
