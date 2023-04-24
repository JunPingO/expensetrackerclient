import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth_service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../models/models';

@Component({
  selector: 'app-registerpage',
  templateUrl: './registerpage.component.html',
  styleUrls: ['./registerpage.component.css']
})
export class RegisterpageComponent {
  form! : FormGroup
  hide = true


  constructor(private fb : FormBuilder, 
    private authService : AuthService,
    private router : Router,
    private snackBar : MatSnackBar,
    ){}


  ngOnInit(): void {
    this.form = this.createForm()
  }


  createForm(){
    return this.fb.group({
      name : this.fb.control('',[Validators.required]),
      email : this.fb.control('',[Validators.required, Validators.email]),
      password: this.fb.control('',[Validators.required]),
      target: this.fb.control('', [Validators.required])
    })
  }


  register(){
    const user : User = {
      "name" : this.form.value['name'],
      "email" : this.form.value['email'],
      "password" : this.form.value['password'],
    }
    this.authService.register(user).then(
      token => {
        this.authService.jwt = token['token']
        localStorage.setItem(user.email, token['token'])}
        ).then(() => {
          this.router.navigate([''])
          this.snackBar.open(`logged in as ${user.email}`, 'OK',{duration : 2000})
        })
        .catch(error => {
          console.error(error)
          this.snackBar.open(error['error']['message'], 'DISMISS', {duration: 2000})
        })
  }
}
