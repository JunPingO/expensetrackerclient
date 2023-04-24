import { AfterViewChecked, Component, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth_service';
import { BackendService } from '../service/backend_service';
import { ExpenseAccount } from '../models/models';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent{
  form!: FormGroup
  email!: string
  groups: ExpenseAccount[] = []

  constructor(private fb:FormBuilder, 
    private router : Router, 
    private authSvc : AuthService,
    private backendSvc : BackendService){
  }

  ngOnInit(){
    this.authenticate()
    this.getGroups()
  }

  authenticate(){
    this.authSvc.authenticate()
    this.authSvc.email.subscribe( email => {
      this.email = email
    })
  }

  getGroups(){
    this.backendSvc.getGroupList(localStorage.getItem("email") || '{}')
      .then(result =>{
          const groupNames = result as ExpenseAccount[]
          groupNames.forEach(f => this.groups.push(f))
        })
  }

  logout(){
      this.backendSvc.logout()
    }

  sendMail(){
    this.backendSvc.sendMail(localStorage.getItem("email") || '{}')
    .then(res => console.log(res))
  }

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  

  
}
