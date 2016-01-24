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
	// var testImageURL = 'http://www.clarifai.com/img/metro-north.jpg';
	// var xin = '@' + __dirname + "/photos/Xinhead.jpg";
	// console.log(xin);
	// var ourId = "train station 1"; // this is any string that identifies the image to your system

	// var path = __dirname + '/photos/Xinhead.jpg',
 //          options = {localFile: true, string: true};

	// base64.base64encoder(path, options, function (err, image) {  
 //    if (err) { console.log(err); }  
 //    console.log('Prob:');

	// 	getProbs(image, 'train', ourId).then(function(res) {
	// 		console.log("res.results[0].result");
	// 		console.log(res.results[0].result);
	// 		console.log(Math.max.apply(null, res.results[0].result.tag.probs));
	// 	}).catch(function(err) {
	// 		console.log(err);
	// 	});
	// });  

	// res.send('On');

	res.sendFile(__dirname + '/index.html');
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


var clients = {};
var socketIds = [];
var pool = [];
var pairs = [];

function printStuff() {
	console.log('-------------');
	console.log('all clients');
	console.log(clients);
	console.log('-------------');
	console.log('all socketIds');
	console.log(socketIds);
	console.log('-------------');
	console.log('pool');
	console.log(pool);
	console.log('-------------');
	console.log('pairs');
	console.log(pairs);
	console.log('-------------');
}

io.on('connection', function(socket) {
	console.log('a user connected');
	console.log(socket.id);

	// Add client to clients object
	clients[socket.id] = socket;
	// Add id to array
  socketIds.push(socket.id);

  socket.emit('hello', { hello: 'world' });

  socket.on('findMatch', function() {
  	console.log(player + " wants to find a match.");
  	pool.push(socket.id);

  	if (pool.length > 1) {
  		// Get from pool
  		var one = pool.shift();
  		var two = pool.shift();
  		// Add to map
  		pairs[one] = two;
  		pairs[two] = one;
  		// Emit messages
  		clients[one].emit('foundMatch', {draw: 'test'});
  		clients[two].emit('foundMatch', {draw: 'test'});
  	}
  });

  // Remove socket from array when user disconencts
  socket.on('disconnect', function () {
    socketIds.splice(socketIds.indexOf(socket.id), 1);
    pool.splice(socketIds.indexOf(socket.id), 1);
    delete clients[socket.id];

    // If is in the pairs map
    if (pairs[socket.id]) {
    	var other = pairs[socket.id];
    	pairs.splice(pairs.indexOf(socket.id), 1);
    	pairs.splice(pairs.indexOf(other), 1);
    } 
    console.log('a user disconnected');
    io.emit('user disconnected');
  });

  printStuff();
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
	










