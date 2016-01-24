var app 			= require('express')();
var http 			= require('http').Server(app);
var io 				= require('socket.io')(http);
var base64 		= require('node-base64-image');
var Promise 	= require('promise');

var Clarifai 	= require('./clarifai_node.js');

var clientID 	= "yNGG_Nxg9HrT5-9v1aCT99IF2mH_NHSzw6TNqZva";
var clientSec = "Ccw5CtVqNXsxa3jzgzFCzM4J4GWdrJoCwIabCNtb";

Clarifai.initAPI(clientID, clientSec);

app.get('/', function(req, res) {
	var testImageURL = 'http://www.clarifai.com/img/metro-north.jpg';
	var xin = '@' + __dirname + "/photos/Xinhead.jpg";
	console.log(xin);
	var ourId = "train station 1"; // this is any string that identifies the image to your system

	var path = __dirname + '/photos/Xinhead.jpg',
          options = {localFile: true, string: true};

	base64.base64encoder(path, options, function (err, image) {  
    if (err) { console.log(err); }  
    console.log('Prob:');

		getProbs(image, 'train', ourId).then(function(res) {
			console.log("res.results[0].result");
			console.log(res.results[0].result);
			console.log(Math.max.apply(null, res.results[0].result.tag.probs));
		}).catch(function(err) {
			console.log(err);
		});
	});  

	res.send('On');
});



function getProbs(data, class_name, ourId) {
	return new Promise(function (resolve, reject) {
		Clarifai.getProbsEncodedData(data , class_name, ourId, function(err, res) {
			if(err) {
				reject(err);
			} else {
				resolve(res);
			}
		});
	});
}



var socketIds = [];

io.on('connection', function(socket) {
  console.log('a user connected');
  socketIds.push(socket);

  socket.on('join', function(player) {
  	console.log(player + " wants to join.");

  });


  socket.on('disconnect', function () {
    socketIds.splice(socketIds.indexOf(socket), 1);
    io.emit('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
	










