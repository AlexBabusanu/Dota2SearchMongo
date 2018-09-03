import { Component, OnInit } from '@angular/core';
import { SteamService } from '../../shared/steamApi.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  error;


  constructor(private steamApi:SteamService) { }

  ngOnInit() {
    this.steamApi.userSteam("76561197987293034").subscribe(
      (res) => {},
      (err) => this.error = err
    )
  }

}
