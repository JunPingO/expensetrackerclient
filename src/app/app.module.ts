import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
import { GoogleloginComponent } from './components/googlelogin.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { MainComponent } from './components/main.component';
import { MaterialModule } from './materiallist';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './service/auth_service';
import { RegisterpageComponent } from './components/registerpage.component';
import { AccountComponent } from './components/account.component';
import { BackendService } from './service/backend_service';
import { TransactionsComponent } from './components/transactions.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DisplayComponent } from './components/display.component';


const appRoutes: Routes = [
  { path: '', component: MainComponent},
  { path: 'login', component: LoginComponent},
  { path: 'googlelogin', component: GoogleloginComponent},
  { path: 'register', component: RegisterpageComponent},
  { path: 'main', component: MainComponent},
  { path: 'createAccount', component: AccountComponent},
  { path: 'transactions/:groupname', component: TransactionsComponent},
  { path: 'display/:groupname', component: DisplayComponent},
  { path: '**', redirectTo: '/', pathMatch: 'full'}
]

@NgModule({
  declarations: [
    AppComponent,
    GoogleloginComponent,
    LoginComponent,
    MainComponent,
    RegisterpageComponent,
    AccountComponent,
    TransactionsComponent,
    DisplayComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    RouterModule.forRoot(appRoutes, {useHash: true}),
    MaterialModule,
    BrowserAnimationsModule,
    NgxChartsModule
  ],
  providers: [AuthService, BackendService],
  bootstrap: [AppComponent]
})
export class AppModule { }
