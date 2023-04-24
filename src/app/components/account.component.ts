import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BackendService } from '../service/backend_service';
import { ExpenseAccount } from '../models/models';
import { AuthService } from '../service/auth_service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent{
  form!: FormGroup
  email !: string

  constructor(private fb:FormBuilder, 
    private router : Router,
    private backendSvc : BackendService,
    private authSvc : AuthService){
  }

  ngOnInit(){
    this.form = this.createForm();
    console.info(this.authSvc.email)
  }

  // ngAfterViewInit(){
  //   this.retrieveEmail()
  // }
  
  private createForm(): FormGroup {
    return this.fb.group({
      groupName: this.fb.control<string>('', [ Validators.required]),
    })
  }

  retrieveEmail(){
    this.authSvc.email.subscribe( (email) => {
      this.email = email
      console.log("hello" + email)
    })
  }

  addAccount(){
    this.authSvc.authenticate()
    var email = localStorage.getItem('email') || '{}'
    const account : ExpenseAccount = {
      "groupName" : this.form.value['groupName'],
      "email" : email,
    }
    this.backendSvc.addGroup(account)
    localStorage.removeItem("email")
    this.router.navigate(['/main'])

    // this.authSvc.email.subscribe( (email) => {
    //   this.email = email
    //   console.log("hello" + email)
    //   const account : ExpenseAccount = {
    //     "groupName" : this.form.value['groupName'],
    //     "email" : email,
    //   }
    //   this.backendSvc.addGroup(account)
    //   })
  }
}
