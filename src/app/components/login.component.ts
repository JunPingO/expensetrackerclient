import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleApiService, UserInfo } from '../service/google_api_service';
import { UserDetail, gDoc } from '../models/models';
import { lastValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth_service';
import { BackendService } from '../service/backend_service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private router : Router,  
    private fb: FormBuilder,
    private authService : AuthService,
    private backendService: BackendService ) {
  }
  display !: boolean

  form !: FormGroup
  userDetail!: UserDetail
  
  mailSnippets: string[] = []

  ngOnInit() {
    this.form = this.createForm()



  }

  private createForm(): FormGroup {
    return this.fb.group({
      email: this.fb.control<string>('', [Validators.required, Validators.email]),
      password: this.fb.control<string>('', [ Validators.required]),
    })
  }

  login(){
    this.authService.getJwtToken(this.form.value['email'], this.form.value['password'])
  }

}
