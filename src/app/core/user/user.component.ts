import { Component, OnInit } from '@angular/core';
import { SteamService } from '../../shared/steamApi.service';
import { ActivatedRoute } from '@angular/router';
import { UserModel } from '../../shared/users.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user;
  
  constructor(private steamApi:SteamService, private route:ActivatedRoute) { }

  ngOnInit() {
    this.steamApi.userSteam(this.route.snapshot.params.id).subscribe(
      (res) => {        
        let help = new UserModel(res);
        this.user = help
      },
      
    )
  }

}
