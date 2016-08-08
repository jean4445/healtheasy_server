var express = require('express');
var mongodb = require('mongodb');
var app = express();
var md5=require('md5');

var mongodbURL = 'mongodb://jean4445jean4445:jean4445@ds011705.mlab.com:11705/userinformation';

var myDB;
mongodb.MongoClient.connect(mongodbURL, function(err, db) {
	if (err) {
		console.log(err);
	} else {
		myDB = db;
		console.log('connection success');
	}
});

app.get('/', function(request, response) {
	response.status(200).send('<html><body><H1>Hello World</H1></body></html>');
	response.end();
});

app.get('/api/test', function(request, response) {
	
	var collection = myDB.collection('user_data');
	collection.find({}).toArray(function(err, docs) {
		if (err) {
			response.status(406).end();
			
		} else {
			response.type('application/json');
			response.status(200).send(docs);
			response.end();
		}
	})
});

app.get('/api/insert', function(request, response) {
	var item = {
    name:request.query.name,
	account:request.query.account,
	password:md5(request.query.password),
	sex:request.query.sex,
	birthday:request.query.birthday,
	height:request.query.height,
	weight:request.query.weight,
	email:request.query.email,
	phone:request.query.phone
	}
	var collection = myDB.collection('user_data');
	collection.insert(item, function(err, result) {
		if (err) {
			response.status(406).send(err).end();
		} else {
			response.type('application/json');
			response.status(200).send(result).end();
		}
	});
});
app.get('/api/query',function(request,reponse){
	var item = {
	account : request.query.account,
	password :md5(request.query.password),
	}
	var collection = myDB.collection('user_data');
	collection.find({account : request.query.account}, {password: 1,name: 1}).toArray(function(err,docs){
		if (err) {
			response.status(406).send(err).end();
		} else {
			response.type('application/json');
			response.status(200).send(docs).end();
		}
	});
	
});

app.get('/api/checkaccount', function(request, response) {
	var item = {
	 account : request.query.account
	}
	var collection = myDB.collection('user_data');
	collection.find({account: request.query.account} , {account:1}).toArray(function(err, docs) {
		if (err) {
			response.status(406).send(err).end();
		} else {
			var jsArray = new Array();
            var jsArray = docs; 
            var docs2 = []; 
            for(var i = 0; i < jsArray.length; i++){
                var jsObj = Object();
                var jsObj = jsArray[i];
            if(jsObj.account != " " && jsObj.account !=""){
					docs2 += jsObj.account;
                }
                }  
 
             if(docs2.length == 0)
             { 

            st = [{
            	account : "0"
            }]
            response.type('application/json');
			response.status(200).send(st).end();
			
             }
           
             else{
             	st2 = [{
             		account : "1"
             	}]
			        response.type('application/json');
			        response.status(200).send(st2).end();
                 }
		}
	});
});


app.listen(process.env.PORT||5000);