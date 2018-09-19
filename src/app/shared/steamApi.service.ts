import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import "rxjs";
import { mergeMap, map} from 'rxjs/operators';
import { forkJoin } from "rxjs";

@Injectable()
export class SteamService {
    apiKey = "BD496BFA7696FD5DE7D3FF190B371B1B";

    constructor(private http:HttpClient) {}

    //get inventory and user details -> merge them and send.
    userSteam(steamId) {
        let mergedInfo = forkJoin(
            this.getInventory(steamId), 
            this.getDetails(steamId)
        ).pipe(
            map(([inventory, summary]) => {
                if(inventory["result"].status === 1){
                    return { inventory, summary }
                }                                
            })
        )
        return mergedInfo;
    }

    //get user details
    getDetails(steamId){
        return  this.http.get("https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=" + this.apiKey + "&steamids=" + steamId);
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
                        friends.push(this.userSteam(friend.steamid));
                    }
                    return forkJoin(friends);
                }                  
            )
        )
    }   

    //get items that property name contains string
    getItemThatContains(string){
        return this.http.get("http://localhost:3000/checkString", {params: {itemString: string}});
    }
    //get specific item
    getItem(index){
        return this.http.get("http://localhost:3000/mongo", {params: {itemIndex: index}});
    }

    login(){
        return this.http.get("http://localhost:3000/auth");
    }

}