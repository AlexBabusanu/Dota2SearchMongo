import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SteamService } from '../../shared/steamApi.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  error:boolean;
  steamID = "";
  constructor(private router:Router, private steamApi:SteamService) { }
  

  ngOnInit() {
    if(localStorage.length > 0) {
      let user =  localStorage.getItem("user");
      this.router.navigate(["/", user]);
    }
  }

  submit(event){ 
    this.steamApi.getDetails(event.target.value).subscribe(
      (res) => {
        if(res["response"].players.length === 0){
          this.error = true;
        }
        else {
          this.router.navigate(["", event.target.value]);
        }
      }
    )   
    
  }

  steam(){
    window.location.href = "http://Dota2Inventory.com/auth";
  }
}
