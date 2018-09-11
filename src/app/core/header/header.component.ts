import { Component, OnInit } from '@angular/core';
import { SteamService } from '../../shared/steamApi.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UserModel } from '../../shared/users.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  error:any;
  mainUser = false;
  user:any;

  constructor(private steamApi:SteamService, private router: ActivatedRoute, private routes:Router) {
    routes.events.subscribe(
      (event) => {
        if(event instanceof NavigationEnd && event.url != "/") {
          this.mainUser = true;
          this.steamApi.userSteam(router.root.firstChild.snapshot.params.id).subscribe(
            (res) => {
              let m = new UserModel(res);
              this.user = m;
            }
          )
        }
        else if(event instanceof NavigationEnd && event.url === "/") {
          this.mainUser = false;
          this.user = "";
        }
        
      }
      
    )
   }

  ngOnInit() {
    
    this.steamApi.userSteam("76561197987293034").subscribe(
      (res) => {        
      },
      (err) => this.error = err
    )
    
  }

}
