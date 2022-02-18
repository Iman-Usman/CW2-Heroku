const express = require("express");
var path = require("path");
const app = express();

//static file middleware that returns lesson images
var publicPath = path.resolve(__dirname,"public");
var imagePath = path.resolve(__dirname,"image");
app.use('/public',express.static(publicPath));
app.use('/images',express.static(imagePath));
app.use(function(req, res){
    res.status(404);
    res.send("Error: File not found");
});

const port = process.env.PORT || 3000
app.listen(port)