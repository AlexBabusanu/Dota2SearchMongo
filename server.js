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
        var dbo = db.db("mydb");
        dbo.collection("Dota2Items").findOne({id: Number(req.query.itemIndex)} ,function(err, result){
            res.send(result);
            db.close();
        })
    });
    
})
app.get("/item", (req, res) => {
    let currentPath = dota2items.items_game.items[req.query.itemIndex];
    if(currentPath){
        currentPath.index = req.query.index;
        if(typeof currentPath.used_by_heroes === "object"){
            currentPath.used_by_heroes = Object.keys(currentPath.used_by_heroes)[0].replace(/_/g, " ").replace(/(?:npc dota hero )/, "");
        }
        if(dota2icons[currentPath.name]) {
            currentPath.image_inventory = dota2icons[currentPath.name];
        }
        else{
            currentPath.image_inventory = dota2paths[req.query.itemIndex].path;
        }
    }
    res.send(dota2items.items_game.items[req.query.itemIndex]);
})

const port = 3000;

app.listen(port, () => console.log("Node server running on port: " + port));