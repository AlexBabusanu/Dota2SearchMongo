import { Component, OnInit } from '@angular/core';
import { SteamService } from '../../../shared/steamApi.service';
import { ActivatedRoute } from '@angular/router';
import { UserModel } from '../../../shared/users.model';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css']
})
export class FriendListComponent implements OnInit {
  friends:any = [];
  loading:boolean = true;
  error:any;
  items:any = [];
  
  inputName = new FormControl();

  constructor(private steamApi:SteamService, private route:ActivatedRoute) { }

  ngOnInit() {
    this.inputName.valueChanges.pipe(debounceTime(500)).subscribe(
      (val) => {
        for(let friend of this.friends) {
          friend.hasItem = false;
        }
        this.items = [];
        if(val.length > 1){
          this.search(val.toLowerCase());
          
        }
      }
    )
    this.steamApi.getFriends(this.route.snapshot.params.id).subscribe(
      (res) => {
        for (let friend of res) {          
          if (friend) {            
            let modeledFriend = new UserModel(friend);           
            this.friends.push(modeledFriend);            
          }
        }
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        this.error = err;
      }
    )
  }

  setSearch(itemName){
    this.search(itemName);
    this.inputName.setValue(itemName);
  }

  search(itemName:string) {
    if(itemName.length === 0){
      return;
    }
    this.steamApi.getItemThatContains(itemName).subscribe(
      (res) => {
        for(let x = 0; x<5; x++){
          if(res[x]){
            this.items.push(res[x]);
          }  
        }  
        Object.keys(res).map(key => {         
          for(let friend of this.friends){
            if(friend.inventory.findIndex(x => x.defindex == res[key]["id"]) != "-1"){
              friend.hasItem = true;
              continue;
            }    
          }
        });
      }
    )
  }
  
}
