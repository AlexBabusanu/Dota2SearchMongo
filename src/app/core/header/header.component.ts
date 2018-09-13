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
  mainUser:boolean = false;
  user:any = "";
  logged: boolean = false;

  constructor(private steamApi:SteamService, private routes: ActivatedRoute, private router:Router) {
    //modify header acording to router page
    router.events.subscribe(
      (event) => {

        //if page isn't "home"
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

        //if page is "home"
        else if(event instanceof NavigationEnd && event.url === "/") {
          this.mainUser = false;
          this.user = "";
          this.logged = false;
        }        
      }      
    )
  }

  ngOnInit() {
    //if localstorage has user login to that user
    if(localStorage.length > 0) {
      this.logged = true;
    }
    //check if steam API service is up
    this.steamApi.userSteam("76561197987293034").subscribe(
      (res) => {},
      (err) => this.error = err
    )    
  }
  //logout from stored user
  logout(){
    localStorage.removeItem("user");
    this.router.navigate([""]);
  }

}
