import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import "rxjs";
import { mergeMap, mergeAll, map, catchError, switchMap } from 'rxjs/operators';
import { forkJoin, throwError, Observable } from "rxjs";

@Injectable()
export class SteamService {
    apiKey = "BD496BFA7696FD5DE7D3FF190B371B1B";

    constructor(private http:HttpClient) {}

    //get user steam details
    userSteam(steamId) {
        return this.getInventory(steamId).pipe(
            switchMap(
                (res) => {
                    if(res["result"].status === 1){
                        return this.http.get("https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=" + this.apiKey + "&steamids=" + steamId) 
                    }
                    else {
                        return "er";
                    }
                }
            )
        )
    }

    //get player inventory details
    getInventory(steamId) {
        return this.http.get("http://api.steampowered.com/IEconItems_570/GetPlayerItems/v0001/?key=" + this.apiKey + "&steamid=" + steamId);
    }

    //get list of friends
    getFriends(steamId) {
        return this.http.get("https://api.steampowered.com/ISteamUser/GetFriendList/v1/?key=" + this.apiKey + "&steamid=" + steamId).pipe(
            mergeMap(
                (res) => {                    
                    let friends = [];
                    for (let friend of res["friendslist"].friends){
                        friends.push(this.userSteam(friend.steamid))
                    }
                    return forkJoin(friends);
                }                  
            )
        )
    }

    
    // getInventoryItems(steamId) {
    //     return this.getInventory(steamId).pipe(
    //         mergeMap(
    //             (res) => {
    //                 console.log(res);
    //                 let itemList = [];
    //                 for(let x=0; x<20; x++){
    //                     console.log(res["result"]["items"][x]);
    //                     itemList.push(
    //                         this.getItem(res["result"]["items"][x]["defindex"])
    //                     )
    //                 }
    //                 // for(let item of res["result"]["items"]){                        
    //                 //     itemList.push(
    //                 //         this.getItem(item["defindex"])
    //                 //     )
    //                 // }
    //                 return forkJoin(itemList);
    //             }
    //         )
    //     )

    // }
    getInventoryItems(steamId){
        return this.getInventory(steamId);
    }
    
    getInventoryItemsDetail(index){
        return this.getItem(index);
    }

    getItemThatContains(string){
        return this.http.get("http://localhost:3000/checkString", {params: {itemString: string}});
    }
    //get specific item
    getItem(index){
        return this.http.get("http://localhost:3000/mysql", {params: {itemIndex: index}})
        //return this.http.get("http://localhost:3000/item", {params: {itemIndex: index}})
    }

}