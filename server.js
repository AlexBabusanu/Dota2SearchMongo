const express = require("express");
const cors = require("cors");
const app = express();
const mongo = require("mongodb").MongoClient;

const url = "mongodb://skidi:mercury@dota2search-shard-00-00-odko1.mongodb.net:27017,dota2search-shard-00-01-odko1.mongodb.net:27017,dota2search-shard-00-02-odko1.mongodb.net:27017/test?ssl=true&replicaSet=Dota2Search-shard-0&authSource=admin&retryWrites=true";



app.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}));

app.get("", (req, res)=> {
    res.send("hellow world")
})


app.get("/mysql", (req, res) => {
    mongo.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        const dbo = db.db("mydb");
        dbo.collection("Dota2Items").findOne({id: Number(req.query.itemIndex)} ,function(err, result){
            res.send(result);
            db.close();
        })
    });
    
})

app.get("/checkString", (req, res)=> {
    mongo.connect(url, {useNewUrlParser: true}, function(err, db){
        if(err) throw err;
        const dbo = db.db("mydb");
        const regex = new RegExp( req.query.itemString, "i");
        dbo.collection("Dota2Items").find({"name": regex}).toArray(function(err, response){
            if(err) throw err;
            res.send(response);
        })
    });
    
})

const port = 3000;

app.listen(port, () => console.log("Node server running on port: " + port));