export class Item {
    name:string;
    image:string;
    rarity:string;
    hero?:any;
    slot?:string;
    type:string;

    constructor(details){
        this.name = details.name;
        this.image = (details.image_alt1 === "http://cdn.dota2.com/apps/570/" ? details.image_alt2 : details.image_alt1 );
        this.rarity = details.item_rarity;
        this.type = details.prefab.replace("_", " ");
        this.hero = (details.used_by_heroes === 1? "" : details.used_by_heroes.replace("npc_dota_hero_", "").replace("_", " "));
        this.slot = details.item_slot;
    }


}