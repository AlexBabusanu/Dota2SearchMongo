import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SteamService } from '../../shared/steamApi.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router:Router, private steamApi:SteamService) { }

  ngOnInit() {
    if(localStorage.length > 0) {
      let user =  localStorage.getItem("user")
      this.router.navigate(["/", user])
    }
  }

  submit(event){    
    this.router.navigate(["", event.target.value])
  }

  steam(){
    window.location.href = "http://localhost:3000/auth"
  }
}
