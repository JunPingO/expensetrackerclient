import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Observable, Subject, lastValueFrom } from "rxjs";
import { User, AuthPayload } from "../models/models";

@Injectable()
export class AuthService {

  constructor(private httpClient: HttpClient, private router : Router, private snackbar: MatSnackBar) {}

  jwt!: string
  email = new Subject<string>()
  authpayload !: AuthPayload

  getJwtToken(username: string, password: string) {
    const credentials  = {
        "email" : username,
        "password" : password
    }
    
    lastValueFrom(this.httpClient.post<any>('/api/auth/login', credentials))
    .then(token => {
        this.jwt = token['token']
        localStorage.setItem("email", username)
        localStorage.setItem("jwt", this.jwt)
      }).then(() => {
          this.router.navigate(['/main'])
          this.snackbar.open(`logged in as ${username}`, 'OK',{duration : 2000})
      }).catch(error => {
        console.error(error)
      })
  }

  register(user : User) : Promise<any> {
    return lastValueFrom(this.httpClient.post<any>('/api/auth/register', user))
  }

  async authenticate(): Promise<any>{
    const jwt = localStorage.getItem("jwt")
    console.log("authenticating...")
    const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${jwt}`)
    try {
      const payload = await lastValueFrom(this.httpClient.get('/api/auth/authJWT', { headers: headers }));
      var json = JSON.parse(JSON.stringify(payload)).email;
      localStorage.setItem("email", json);
      this.email.next(json);
    } catch (error) {
      console.error(error, "authentication failed");
      this.router.navigate(['/login']);
    }
    
  }

}