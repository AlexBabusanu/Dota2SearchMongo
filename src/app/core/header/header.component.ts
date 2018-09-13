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
  logged: boolean = false;

  constructor(private steamApi:SteamService, private routes: ActivatedRoute, private router:Router) {
    router.events.subscribe(
      (event) => {
        if(event instanceof NavigationEnd && event.url != "/") {
          this.mainUser = true;
          this.steamApi.userSteam(routes.root.firstChild.snapshot.params.id).subscribe(
            (res) => {
              let m = new UserModel(res);
              this.user = m;
              this.logged = true;
            }
          )
        }
        else if(event instanceof NavigationEnd && event.url === "/") {
          this.mainUser = false;
          this.user = "";
          this.logged = false;
        }
        
      }
      
    )
   }

  ngOnInit() {
    if(localStorage.length > 0) {
      this.logged = true;
    }
    this.steamApi.userSteam("76561197987293034").subscribe(
      (res) => {        
      },
      (err) => this.error = err
    )
    
  }

  logout(){
    localStorage.removeItem("user");
    this.router.navigate([""]);
  }

}
