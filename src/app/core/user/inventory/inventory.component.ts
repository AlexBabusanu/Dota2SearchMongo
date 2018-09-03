import { Component, OnInit } from '@angular/core';
import { SteamService } from '../../../shared/steamApi.service';
import { ActivatedRoute } from '@angular/router';
import { PageService } from '../../../shared/pagination.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Item } from '../../../shared/items.model';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  items = [];
  itemDetails = [];

  pager:any = {};
  pagedItems:any = [];

  page:any = [];
  inputName = new FormControl();

  constructor(private steamApi: SteamService, private root:ActivatedRoute, private pageService:PageService) { }

  ngOnInit() {
    this.inputName.valueChanges.pipe(debounceTime(500)).subscribe(
      (val) => this.search(val.toLowerCase())
    )
    this.steamApi.getInventoryItems(this.root.snapshot.params.id).subscribe(
      (res) => {
        for(let item of res["result"]["items"]){
          //let itemModeled = new Item(item);
          this.items.push(item);
        }
      },
      (err) => console.log(err),
      () => this.search("")
    )
    
  }
  search(itemName:string) {  
    
    this.page = this.items.filter(
      item => item.id.toString().includes(itemName)   
    );
    this.setPage(1);
  }
  setPage(page:number){
    this.itemDetails = [];
    this.pager = this.pageService.getPages(this.page.length, page);    
    this.pagedItems = this.page.slice(this.pager.startIndex, this.pager.endIndex + 1);
    for(let x=this.pager.startIndex; x < this.pager.endIndex+1; x++){
      this.steamApi.getInventoryItemsDetail(this.items[x].defindex).subscribe(
        (res) => {
          let itemModel = new Item(res);
          this.itemDetails.push(itemModel);
          
        }
      )
    }   
  }

}
