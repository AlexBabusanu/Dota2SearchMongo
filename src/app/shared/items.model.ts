export class Item {
    name:string;
    image:string;
    rarity:string;
    hero?:any;
    slot?:string;
    type:string;

    constructor(details){
        this.name = details[0].name;
        this.image = (details[0].image_alt1 === "http://cdn.dota2.com/apps/570/" ? details[0].image_alt2 : details[0].image_alt1 );
        this.rarity = details[0].item_rarity;
        this.type = details[0].prefab.replace("_", " ");
        this.hero = (details[0].used_by_heroes === 1? "" : details[0].used_by_heroes.replace("npc_dota_hero_", "").replace("_", " "));
        this.slot = details[0].item_slot;
    }


}