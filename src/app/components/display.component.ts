import { Component, ViewChild } from '@angular/core';
import { Transaction, gDoc } from '../models/models';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../service/auth_service';
import { BackendService } from '../service/backend_service';
import { GoogleApiService } from '../service/google_api_service';
import { NgxCaptureModule, NgxCaptureService } from 'ngx-capture';
import { tap } from 'rxjs';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent {

  @ViewChild('screen', { static: true }) screen: any;

  constructor(private router : Router,
    private activatedRoute: ActivatedRoute,
    private backendSvc : BackendService,
    private authSvc : AuthService,
    private readonly googleApi:GoogleApiService,
    private captureService: NgxCaptureService){
  }

  txnList : Transaction[] = []
  txnListChart : Transaction[] = []
  groupName !: string
  data : any[] = [] 
  img = '';
  body = document.body;

  gdoc !: gDoc;
  token = this.googleApi.getAccessToken()
  // data = [{"name":"1", "value": 1}];

  accessToken = this.googleApi.getAccessToken()

  ngOnInit(){
    this.groupName = this.activatedRoute.snapshot.params['groupname'];
    this.authSvc.authenticate()
    this.getAllTransactions()
    this.pushChartData()
    this.gdoc = this.googleApi.gdoc
  }


  getAllTransactions(){
    var email = localStorage.getItem("email") || '{}'
    this.txnList = []
    this.backendSvc.getTransactions(email, this.groupName)
        .then(result => {
          const txns = result as Transaction[]
          txns.forEach(t => this.txnList.push(t))
        })
  }

  async pushChartData(){
    var email = localStorage.getItem("email") || '{}'
    await this.backendSvc.getTransactions(email, this.groupName)
        .then(result => {
          const txns = result as Transaction[]
          txns.forEach(t => this.txnListChart.push(t))
    })
    let hashMap = new Map()

    for (let i = 0; i < this.txnListChart.length; i++){
      let totalAmount = 0
      if (hashMap.get(this.txnListChart[i].category) != null){
        totalAmount = hashMap.get(this.txnListChart[i].category) + this.txnList[i].amount
      } else {
        totalAmount = this.txnListChart[i].amount
      }
      hashMap.set(this.txnListChart[i].category, totalAmount)
    }
    console.log(hashMap)
    var keys = hashMap.keys()

    for (let i = 0; i < hashMap.size; i++){
      let name = keys.next().value
      let value = hashMap.get(name)
      console.log(value)
      this.data.push(
        {"name" : name, "value" : value}
      )
    }
    this.data = [...this.data];
    console.log(this.data)
  }

  deleteTransaction(transactionID : string){
    this.backendSvc.deleteTransactions(transactionID)
    location.reload()
  }

  fullCapture(){
    this.captureService
      .getImage(this.body, true)
      .pipe(
        tap((img: string) => {
          this.img = img;
          console.log(img);
        })
      )
    .subscribe();
  }


  loginGoogle(){
    this.googleApi.userLoginProcess()
    console.log(this.googleApi.gdoc)
  }

  saveToGoogleDrive(){
    // this.googleApi.userLoginProcess()
    console.log(this.googleApi.getAccessToken())

    var blob = this.dataURItoBlob(this.img).size
    const gKey = localStorage.getItem("gKey") || ''

    this.googleApi.savetoDrive(this.dataURItoBlob(this.img), blob).then(
      result => console.log(result)
    )
  }

  dataURItoBlob(dataURI: string) {
    // convert base64 to raw binary data held in a string
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length)
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], {type: mimeString})
  }
}
