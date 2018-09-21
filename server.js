const express = require("express");
const cors = require("cors");
const app = express();
const mongo = require("mongodb").MongoClient;
const openid = require("openid");
const path = require("path");

//MongoDB database
const url = "mongodb://skidi:mercury@dota2search-shard-00-00-odko1.mongodb.net:27017,dota2search-shard-00-01-odko1.mongodb.net:27017,dota2search-shard-00-02-odko1.mongodb.net:27017/test?ssl=true&replicaSet=Dota2Search-shard-0&authSource=admin&retryWrites=true";


//OpenID settings
const relyingParty = new openid.RelyingParty(
    "http://localhost:3000/verify",
    "http://localhost:3000",
    true,
    true,
    []
);

//Cross origin settings
app.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}));

app.use(express.static(path.join(__dirname, 'dist')));

//Authenticate OpenId
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

//Verify OpenId
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
           steamId = result.claimedIdentifier.replace('https://steamcommunity.com/openid/id/', '');           
           res.redirect('/'+ steamId);
        }
    })
})

//retrieve dota2items from mongo DB
app.get("/mongo", (req, res) => {
    mongo.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        const dbo = db.db("mydb");
        let sanitized = parseInt(req.query.itemIndex);
        dbo.collection("Dota2Items").findOne({id: Number(sanitized)} ,function(err, result){
            res.send(result);
            db.close();
        })
    });
    
})

//check items that contain string
app.get("/checkString", (req, res)=> {
    mongo.connect(url, {useNewUrlParser: true}, function(err, db){
        if(err) throw err;
        const dbo = db.db("mydb");
        let escaped = req.query.itemString.replace(/[^\w\s]/g, '');
        const regex = new RegExp( escaped, "i");
        dbo.collection("Dota2Items").find({"name": regex}).toArray(function(err, response){
            if(err) throw err;
            res.send(response);
        })
    });
    
})

app.get("*", (req, res)=> {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
})

//create server;
const port = 3000;
app.listen(port, () => console.log("Node server running on port: " + port));