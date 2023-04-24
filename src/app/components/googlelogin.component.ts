import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { GoogleApiService, UserInfo } from '../service/google_api_service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-googlelogin',
  templateUrl: './googlelogin.component.html',
  styleUrls: ['./googlelogin.component.css']
})
export class GoogleloginComponent implements OnInit{

  constructor(private readonly googleApi:GoogleApiService, private router : Router) {
    // googleApi.userProfileSubject.subscribe( info => {
    //   this.userInfo = info
    // });
  }


  accessToken = this.googleApi.getAccessToken()

  ngOnInit() {
    this.googleApi.userLoginProcess()
    localStorage.setItem("gKey", this.googleApi.getAccessToken())
    // console.log("At Google Login" + this.userInfo.info.name)
    // this.googleApi.getUser().then( ans => {
    //   this.userInfo
    // })
  }

  isLoggedIn() : boolean {
    return this.googleApi.isLoggedIn()
  }

  logout() {
    this.googleApi.signOut()
  }

  
}

