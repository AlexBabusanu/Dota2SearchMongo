export class UserModel {
    username:string;
    avatar:string;
    steamId:number;
    hasItem:boolean;
    inventory:any;

    

    constructor(details){
        this.username = details.summary.response.players[0].personaname;
        this.steamId = details.summary.response.players[0].steamid;
        this.avatar = details.summary.response.players[0].avatar;
        this.inventory = details.inventory.result.items;
        this.hasItem = false;
    }
}