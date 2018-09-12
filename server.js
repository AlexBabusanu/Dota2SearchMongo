const express = require("express");

const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const cors = require("cors");
const app = express();

const mongo = require("mongodb").MongoClient;

const openid = require("openid");

const apiKey = "BD496BFA7696FD5DE7D3FF190B371B1B";
const url = "mongodb://skidi:mercury@dota2search-shard-00-00-odko1.mongodb.net:27017,dota2search-shard-00-01-odko1.mongodb.net:27017,dota2search-shard-00-02-odko1.mongodb.net:27017/test?ssl=true&replicaSet=Dota2Search-shard-0&authSource=admin&retryWrites=true";

const relyingParty = new openid.RelyingParty(
    "http://localhost:3000/verify",
    "http://localhost:3000",
    true,
    true,
    []
);

app.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}));

app.use(session({
    secret: "hotdog",
    store: new RedisStore({
        host: "localhost",
        port: 6379,
    }),
    saveUninitialized: true,
    resave: false,
}));

app.get("", (req, res)=> {
    res.send("hellow world")
});


app.get("/auth", (req, res) => {
    
    relyingParty.authenticate('https://steamcommunity.com/openid', false, (err, authUrl)=>{
        if(err){
            console.log(err);
            res.write("Authentication failed: " + err);
        }
        if(!authUrl){
            res.write("AUthentication failed.");
        }
        else{
            res.writeHead(301, {"location": authUrl});
        }
        res.end();
    })
});

app.get("/verify", (req, res) => {
    relyingParty.verifyAssertion(req, (err, result)=> {
        if(err){
            console.log(err);
            res.end("error.");
        }
        else if(!result || !result.authenticated) {
            res.end("failed to authenticate.");
        }
        else {
           //console.log(JSON.stringify(result.claimedIdentifier));
            steamId = result.claimedIdentifier.replace('https://steamcommunity.com/openid/id/', '');
           console.log(steamId);
           res.send(steamId);
        }
    })
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