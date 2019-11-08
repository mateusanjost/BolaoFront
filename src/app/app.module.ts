import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ConfigService } from './config.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from "@angular/router";
import { ResultComponent } from './result/result.component';
import { HomeComponent } from './home/home.component';
import { TicketComponent } from './ticket/ticket.component';
import { RuleComponent } from './rule/rule.component';
import { ContactComponent } from './contact/contact.component';
import { AdminComponent } from './admin/admin.component';
import { RoundComponent } from './round/round.component';
import { PostResultComponent } from './post-result/post-result.component';
import { JackpotComponent } from './jackpot/jackpot.component';
import { ManageTicketComponent } from './manage-ticket/manage-ticket.component';
import { ReportComponent } from './report/report.component';
import { JurisdictionComponent } from './jurisdiction/jurisdiction.component';
import { MAT_DATE_LOCALE } from '@angular/material';
import { CreditTransferComponent } from './credit-transfer/credit-transfer.component';
import { SettingsComponent } from './settings/settings.component';


@NgModule({
  declarations: [
    AppComponent,
    ResultComponent,
    HomeComponent,
    TicketComponent,
    RuleComponent,
    ContactComponent,
    AdminComponent,
    RoundComponent,
    PostResultComponent,
    JackpotComponent,
    ManageTicketComponent,
    ReportComponent,
    JurisdictionComponent,
    CreditTransferComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forRoot([
      {path: 'home', component: HomeComponent},
      {path: 'result', component: ResultComponent},
      {path: 'ticket', component: TicketComponent},
      {path: 'rule', component: RuleComponent},
      {path: 'contact', component: ContactComponent},
      {path: 'admin', component: AdminComponent},
      {path: 'round', component: RoundComponent},
      {path: 'post-result', component: PostResultComponent},
      {path: 'jackpot', component: JackpotComponent},
      {path: 'manage-ticket', component: ManageTicketComponent},
      {path: 'report', component: ReportComponent},
      {path: 'jurisdiction', component: JurisdictionComponent},
      {path: 'credit-transfer', component: CreditTransferComponent},
      {path: 'settings', component: SettingsComponent},
      { path: '', redirectTo: '/home', pathMatch: 'full' }
    ])
  ],
  providers: [
    ConfigService,
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
    