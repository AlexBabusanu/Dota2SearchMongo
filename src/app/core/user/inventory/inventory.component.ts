import { Component, OnInit } from '@angular/core';
import { SteamService } from '../../../shared/steamApi.service';
import { ActivatedRoute } from '@angular/router';
import { PageService } from '../../../shared/pagination.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Item } from '../../../shared/items.model';
import { UserModel } from 'src/app/shared/users.model';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  user:any;
  items:any = [];
  itemDetails:any = [];
  itemName:any;
  //pages and nr of items per page stored
  pager:any = {};
  pagedItems:any = [];

  page:any = [];
  inputName = new FormControl();

  constructor(private steamApi: SteamService, private root:ActivatedRoute, private pageService:PageService) { }

  ngOnInit() {
    this.inputName.valueChanges.pipe(debounceTime(500)).subscribe(
      (val) => this.search(val.toLowerCase())
    )
    
    this.steamApi.userSteam(this.root.snapshot.params.id).subscribe(
      (res) => { 
        let userModeled = new UserModel(res);
        this.user = userModeled;
        console.log(this.user);
        for(let item of res["inventory"]["result"]["items"]){
          this.items.push(item);
        }
      },
      (err) => console.log(err),
      () => {        
        this.page = this.items;
        this.setPage(1);
      }
    )
    
  }
  search(itemName:string) {       
    this.steamApi.getItemThatContains(itemName).subscribe(
      (res) => {
         let arrayRes = [];
         arrayRes.push(res);
        let resultItems = [];
         for(let item of arrayRes[0]) {
          resultItems.push(item.id);
         }        
        this.page = this.items.filter(i => resultItems.includes(i.defindex));        
        this.setPage(1);
      }
    )    
  }
  setPage(page:number){
    this.itemDetails = [];
    this.pager = this.pageService.getPages(this.page.length, page);    
    this.pagedItems = this.page.slice(this.pager.startIndex, this.pager.endIndex + 1);   
    if(this.page.length >0){   
      for(let x=this.pager.startIndex; x < this.pager.endIndex+1; x++){      
        this.steamApi.getItem(this.page[x].defindex).subscribe(
          (res) => {
            let itemModel = new Item(res);
            this.itemDetails.push(itemModel);            
          }
        )
      }
    }  
  }

}
