export class UserModel {
    username:string;
    avatar:string;
    isPrivate?:boolean;
    steamId:number;
    

    constructor(details){
        this.username = details.response.players[0].personaname;
        this.steamId = details.response.players[0].steamid;
        this.avatar = details.response.players[0].avatar;
    }
}