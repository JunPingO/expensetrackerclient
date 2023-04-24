import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthConfig, OAuthService } from "angular-oauth2-oidc";
import { Observable, Subject, lastValueFrom } from "rxjs";
import { gDoc } from "../models/models";
import { environment } from './../../environments/environment';

const authCodeFlowConfig: AuthConfig = {
    // Url of the Identity Provider
    issuer: 'https://accounts.google.com',
  
    // strict discovery document disallows urls which not start with issuers url
    strictDiscoveryDocumentValidation: false,
  
    // URL of the SPA to redirect the user to after login
    redirectUri: window.location.origin,
    // redirectUri: "http://localhost:4200",
  
    // The SPA's id. The SPA is registerd with this id at the auth-server
    // clientId: 'server.code',
    clientId: environment.clientId,
  
    // set the scope for the permissions the client should request
    scope: 'openid profile email https://www.googleapis.com/auth/drive.file',
  
    showDebugInformation: true,
  };
  
  export interface UserInfo {
    info: {
      sub: string
      email: string,
      name: string,
      picture: string
    }
  }
  
  @Injectable({
    providedIn: 'root'
  })
  export class GoogleApiService {
  
    gdrive = "https://www.googleapis.com/drive/v3/files"
  
    userProfileSubject = new Subject<UserInfo>()
    gdoc !: gDoc
  
    constructor(private readonly oAuthService: OAuthService, private readonly httpClient: HttpClient) {
      oAuthService.configure(authCodeFlowConfig)
    }

    userLoginProcess() {
        // // confiure oauth2 service
        // this.oAuthService.configure(authCodeFlowConfig);
        // automatically refresh access token when at 70% expiration
        this.oAuthService.setupAutomaticSilentRefresh();
        // manually configure a logout url
        this.oAuthService.logoutUrl = "https://www.google.com/accounts/Logout";

        // load the discovery document from google
        this.oAuthService.loadDiscoveryDocument().then( () => {
        // // This method just tries to parse the token(s) within the url when
        // // the auth-server redirects the user back to the web-app
        // // It doesn't send the user the the login page
          this.oAuthService.tryLoginImplicitFlow().then( () => {
              // when not logged in, redirect to google for login
              // else load user profile
              if (!this.oAuthService.hasValidAccessToken()) {
                this.oAuthService.initLoginFlow()
                // localStorage.setItem("gKey", this.oAuthService.getAccessToken())
              } else {
                this.oAuthService.loadUserProfile().then( user => {
                  var jsonuser = JSON.parse(JSON.stringify(user))
                  var jsoninfo = jsonuser.info
                  this.gdoc = jsoninfo
                  console.log(this.gdoc)
                })
                // localStorage.setItem("gKey", this.oAuthService.getAccessToken())
              }
            })
        });
    }
    
    savetoDrive(boo : Blob, length: number): Promise<any> {
      console.log(">>>>>", this.oAuthService.getAccessToken())
      const formData = new FormData();
      formData.set("file", boo)
      formData.set("name", "test")
      const headers = new HttpHeaders()
        .set('Content-Type', length.toString())
        .set('Content-Length', 'image/png')
        .set('Authorization', `Bearer ${this.oAuthService.getAccessToken()}`)

      return lastValueFrom(
        this.httpClient.post(`https://www.googleapis.com/upload/drive/v3/files?uploadType=media`, formData, {headers : this.authHeader()})
      )
    }
  
    isLoggedIn(): boolean {
      return this.oAuthService.hasValidAccessToken()
    }
  
    signOut() {
      this.oAuthService.logOut()
    }
  
    private authHeader() : HttpHeaders {
      return new HttpHeaders ({
        'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`
      })
    }

    getAccessToken() : string {
      return this.oAuthService.getAccessToken()
    }
  }