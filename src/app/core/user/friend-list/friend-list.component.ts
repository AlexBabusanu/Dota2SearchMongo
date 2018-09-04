import { Component, OnInit } from '@angular/core';
import { SteamService } from '../../../shared/steamApi.service';
import { ActivatedRoute } from '@angular/router';
import { UserModel } from '../../../shared/users.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css']
})
export class FriendListComponent implements OnInit {
  friends = [];
  loading = true;
  error;

  inputName = new FormControl();

  constructor(private steamApi:SteamService, private route:ActivatedRoute) { }

  ngOnInit() {
    this.steamApi.getFriends(this.route.snapshot.params.id).subscribe(
      (res) => {
        for (let friend of res) {
          if (typeof friend !== "string") {
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

}
