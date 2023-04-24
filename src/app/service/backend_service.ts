import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject, lastValueFrom } from "rxjs";
import { ExpenseAccount, Transaction } from "../models/models";
import { group } from "@angular/animations";

@Injectable()
export class BackendService {

    public email !: string
    public username !: string
    emailStore = new Subject<any>()

    constructor(private httpClient: HttpClient, private router : Router) {}

    addGroup(account: ExpenseAccount){
        console.log("reached backendSvc")
        // const headers = new HttpHeaders().set('Content-Type','application/json');
        return lastValueFrom(
          this.httpClient.post('/api/insertgroup', account))
    }

    getGroupList(email: string){
        console.log("reached backendSvc")
        // const headers = new HttpHeaders().set('Content-Type','application/json');
        return lastValueFrom(
          this.httpClient.get(`/api/getgroups/${email}`))
    }

    addTransaction(transaction: Transaction){
        console.log("reached backendSvc")
        // const headers = new HttpHeaders().set('Content-Type','application/json');
        return lastValueFrom(
          this.httpClient.post('/api/addtransaction', transaction))
    }

    getDistincCategories(){
        return lastValueFrom(this.httpClient.get('/api/getcategories')) 
    }

    getTransactions(email: string, groupName: string){
        
        const queryParams = new HttpParams()
            .set('email', email)
            .set('groupname', groupName);
        return lastValueFrom(this.httpClient.get('/api/gettransactions', {params : queryParams})) 
    }

    deleteTransactions(transactionID: string){
        
        const queryParams = new HttpParams()
            .set('transactionID', transactionID);
        return lastValueFrom(this.httpClient.delete('/api/deletetransaction', {params : queryParams})) 
    }

    sendMail(email: string){
        const queryParams = new HttpParams()
            .set('email', email);
        return lastValueFrom(this.httpClient.get('/api/email', {params : queryParams})) 
    }

    logout(){
        localStorage.removeItem('jwt')
        localStorage.removeItem('email')
        this.router.navigate(['/login'])
    }




}