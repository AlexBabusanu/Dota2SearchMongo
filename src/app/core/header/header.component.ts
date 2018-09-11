import { Component, OnInit } from '@angular/core';
import { SteamService } from '../../shared/steamApi.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  error:any;
  mainUser = false;


  constructor(private steamApi:SteamService, private router: ActivatedRoute, private routes:Router) {
    routes.events.subscribe(
      (event) => {
        if(event instanceof NavigationEnd && event.url != "/") {
          this.mainUser = router.root.firstChild.snapshot.params.id;
          this.mainUser = true;

        }
        else if(event instanceof NavigationEnd && event.url === "/") {
          this.mainUser = false;
        }
        
      }
      
    )
   }

  ngOnInit() {
    this.steamApi.userSteam("76561197987293034").subscribe(
      (res) => {},
      (err) => this.error = err
    )
    
  }

}
