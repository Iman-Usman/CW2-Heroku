// Import dependencies modules:
const express = require('express')
const bodyParser = require('body-parser')
//const cors = require("cors");
//app.use(cors());
var path = require("path");
// Create an Express.js instance:
const app = express()
// config Express.js
app.use(express.json())
app.set('port', 3000)
app.use ((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})

// the 'logger' middleware that outputs requests to server console 
app.use(function(req, res, next) {
    console.log("Request IP: " + req.url);
    console.log("Request date: " + new Date());
    next();
});

// connect to MongoDB
const MongoClient = require('mongodb').MongoClient;
let db;
MongoClient.connect('mongodb+srv://iman:dohaqatar1@cluster0.ovv1s.mongodb.net/test', (err, client) => {
    db = client.db('webstore')
})

// dispaly a message for root path to show that API is working
app.get('/', (req, res, next) => {
    res.send('Select a collection, e.g., /collection/messages')
})

// get the collection name
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    // console.log('collection name:', req.collection)
    return next()
})

// retrieve all the objects from an collection
app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e)
        res.send(results)
    })
})

//adding post
app.post('/collection/:collectionName', (req, res, next) => {
req.collection.insert(req.body, (e, results) => {
if (e) return next(e)
res.send(results.ops)
})
})

// return with object id 
const ObjectID = require('mongodb').ObjectID;
app.get('/collection/:collectionName/:id'
, (req, res, next) => {
req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
if (e) return next(e)
res.send(result)
})
})

//update an object 
app.put('/collection/:collectionName/:id', (req, res, next) => {
req.collection.update(
{_id: new ObjectID(req.params.id)},
{$set: req.body},
{safe: true, multi: false},
(e, result) => {
if (e) return next(e)
res.send(result.modifiedCount === 1 ? { msg: "success" } : { msg: "error" })
//res.send((result.result.n === 1) ? {msg: 'success'} : {msg: 'error'})
})
})

//delete an object 
app.delete('/collection/:collectionName/:id', (req, res, next) => {
req.collection.deleteOne(
{ _id: ObjectID(req.params.id) },(e, result) => {
if (e) return next(e)
res.send((result.deletedCount === 1) ?
{msg: 'success'} : {msg: 'error'})
})
})

//static file middleware that returns lesson images
var imagePath = path.resolve(__dirname,"images");
app.use('/images',express.static(imagePath));
app.use(function(req, res, next){
    res.status(404);
    res.send("Error: File not found");
    next();
});

const port = process.env.PORT || 3000
app.listen(port)