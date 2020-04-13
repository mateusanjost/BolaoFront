import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../config.service';
import { AppComponent } from '../app.component';
import { User } from '../user.interface';
import { NgForm } from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @ViewChild('frame', { static: true }) modalUser: ModalDirective;
  @ViewChild('frame2', { static: true }) modalPassword: ModalDirective;

  user: User;
  ownCredit: any;
  isLoaded: boolean = false;
  creditVisibility: boolean = false;

  constructor(private configService: ConfigService, private appComponent: AppComponent,
    private translate: TranslateService) { 
      this.translate.setDefaultLang(this.appComponent.activeLang);
  }

  ngOnInit() {
    this.getUser();
  }

  getUser(){
    this.configService.getUser(this.appComponent.userAdmin.id)
      .subscribe(data => {
        this.user = data;
        this.isLoaded = true;
        document.getElementById("spinner-loading").classList.add("hidden");
        this.setOwnCredit();
      }, error => {
        console.log(error);
      });
  }

  setOwnCredit(){
    this.ownCredit = this.user.credit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  closeModalPassword(){
    this.modalPassword.hide();
  }

  closeModalUser(){
    this.modalUser.hide();
  }

  changePassword(form: NgForm){
    if (form.value.currentPassword == this.user.password && form.value.newPassword == form.value.confirmPassword){
      this.modalPassword.hide();
      this.isLoaded = false;
      this.user.password = form.value.newPassword;
      this.configService.updateUser(this.user.id, this.user)
      .subscribe(data => {
        this.appComponent.msgStandard(this.translate.instant("pg-settings.change-made"), this.translate.instant("pg-settings.change-made-info"), 3);
        this.ngOnInit();
      }, error => {
        this.appComponent.msgStandard(this.translate.instant("pg-settings.change-error"), this.translate.instant("pg-settings.change-error-info"), 4);
        console.log(error);
        this.ngOnInit();
      });
    }
    else {
      this.appComponent.msgStandard(this.translate.instant("pg-settings.password-not-match"), this.translate.instant("pg-settings.password-not-match-info"), 4);
    }
  }

  editUser(form: NgForm){
    if (form.value.userName != "" && form.value.userEmail != ""){
      this.modalUser.hide();
      this.isLoaded = false;
      this.user.name = form.value.userName;
      this.user.lastName = form.value.lastName;
      this.user.email = form.value.userEmail;
      this.user.country = form.value.country;
      this.user.city = form.value.city;
      this.configService.updateUser(this.user.id, this.user)
      .subscribe(data => {
        this.appComponent.msgStandard(this.translate.instant("pg-settings.change-made"), this.translate.instant("pg-settings.data-changed-info"), 3);
        this.ngOnInit();
      }, error => {
        this.appComponent.msgStandard(this.translate.instant("pg-settings.change-error"), this.translate.instant("pg-settings.data-error-info"), 4);
        console.log(error);
        this.ngOnInit();
      });
    }
    else {
      this.appComponent.msgStandard(this.translate.instant("pg-settings.required-field-empty"), this.translate.instant("pg-settings.required-field-empty-info"), 4);
    }
  }

  toggleVisibility(){
    this.creditVisibility = !this.creditVisibility;
  }

}
