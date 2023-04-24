import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth_service';
import { BackendService } from '../service/backend_service';
import { Transaction } from '../models/models';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})

export class TransactionsComponent {
  form!: FormGroup
  groupName !: string
  options : string[] = []
  txnList : Transaction[] = []

  constructor(private fb:FormBuilder, 
    private router : Router,
    private activatedRoute: ActivatedRoute,
    private backendSvc : BackendService,
    private authSvc : AuthService){
  }

  ngOnInit(){
    this.groupName = this.activatedRoute.snapshot.params['groupname'];
    // this.getCategories()
    this.form = this.createForm()
    this.options.push("food")
    this.options.push("entertainment")
    this.options.push("transportation")
    this.options.push("groceries")
    this.options.push("others")
  }

  private createForm(): FormGroup {
    return this.fb.group({
      amount: this.fb.control<number>(0, [ Validators.required, Validators.min(0)]),
      category: this.fb.control<string>('', [ Validators.required]),
      description: this.fb.control<string>(''),
    })
  }

  getCategories(){
    this.backendSvc.getDistincCategories()
    .then(categories =>
      {
        const catList = categories as string[]
        catList.forEach(f => this.options.push(f))
      })
  }

  getAllTransactions(){
    var email = localStorage.getItem("email") || '{}'
    this.txnList = []
    this.backendSvc.getTransactions(email, this.groupName)
        .then(result => {
          console.log(result)
          const txns = result as Transaction[]
          txns.forEach(t => this.txnList.push(t))
        })
  }

  addTransaction(){
    this.authSvc.authenticate()
    var email = localStorage.getItem("email") || '{}'

    const transaction : Transaction = {
      groupName: this.groupName,
      email: email,
      amount: this.form.value['amount'],
      category: this.form.value['category'],
      description: this.form.value['description'],
      date: new Date(),
      transactionID: ''
    }
    this.backendSvc.addTransaction(transaction).then(data =>{
      console.log(data)
    })
    this.router.navigate(['/display', this.groupName])
  }

}
