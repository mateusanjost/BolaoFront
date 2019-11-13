import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { ConfigService } from './config.service';
import { Login } from './login.interface';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('frame', { static: true }) modalLogin: ModalDirective;
  title = 'mdb-angular-free';
  validatingForm: FormGroup;

  public isLogged: boolean = false;
  userAdmin: any;
  public messagesBadge: number;

  public cookie: string;

  constructor(private configService: ConfigService, private cookieService: CookieService){ }

  ngOnInit() {
    this.validatingForm = new FormGroup({
      loginFormModalName: new FormControl('', Validators.required),
      loginFormModalPassword: new FormControl('', Validators.required)
    });

    this.configService.getUnreadMessages()
    .subscribe(data => {
      this.messagesBadge = data.length;
    }, error => {
      console.log(error);
    });

    if(this.cookieService.get('user') != null){
      this.userAdmin = JSON.parse(this.cookieService.get('user'));
      if(this.userAdmin != null){
        this.isLogged = true;
      }
      else{
        this.isLogged = false;
      }
    }      
  }

  // --- LOGIN COMPONENTS --- //
  get loginFormModalName() {
    return this.validatingForm.get('loginFormModalName');
  }

  get loginFormModalPassword() {
    return this.validatingForm.get('loginFormModalPassword');
  }

  getLogin(){
    let log = (<HTMLInputElement>document.getElementById("defaultForm-name")).value;
    let pass = (<HTMLInputElement>document.getElementById("defaultForm-pass")).value;

    this.configService.getLogin(log, pass)
    .subscribe((data: Login) => {
      this.userAdmin = data.user;
      this.isLogged = true;
      this.cookieService.set('user', JSON.stringify(data.user));
      //console.log(this.userAdmin.name);
    }, error =>{
      //console.log(error);
      alert("Usuário ou senha errado!");
    });
    
    (<HTMLInputElement>document.getElementById("defaultForm-name")).value = "";
    (<HTMLInputElement>document.getElementById("defaultForm-pass")).value = "";

    this.modalLogin.hide();

  }

  logout(){
    this.cookieService.deleteAll();
    this.isLogged = false;
    this.userAdmin =  null;

  }
  // --- LOGIN COMPONENTS --- //

  register(){
    let login = (<HTMLInputElement>document.getElementById("orangeForm-login")).value;
    let name = (<HTMLInputElement>document.getElementById("orangeForm-name")).value;

    console.log(login + ' - ' + name);
  }

}