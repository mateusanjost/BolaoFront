import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { ConfigService } from './config.service';
import { User } from './user.interface';
import { Login } from './login.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('frame', { static: true }) modalLogin: ModalDirective;
  title = 'mdb-angular-free';
  validatingForm: FormGroup;

  isLogged: boolean = false;
  userAdmin: any;

  constructor(private configService: ConfigService){

  }

  ngOnInit() {
    this.validatingForm = new FormGroup({
      loginFormModalName: new FormControl('', Validators.required),
      loginFormModalPassword: new FormControl('', Validators.required)
    });
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

    this.isLogged = false;
    this.userAdmin =  null;

  }
  // --- LOGIN COMPONENTS --- //

}