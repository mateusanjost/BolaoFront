import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { ConfigService } from './config.service';
import { Login } from './login.interface';
import { CookieService } from 'ngx-cookie-service';
import { User, UserLoginForm } from './user.interface';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('frame', { static: true }) modalLogin: ModalDirective;
  @ViewChild('frame3', { static: true }) modalRegister: ModalDirective;
  title = 'mdb-angular-free';
  validatingForm: FormGroup;
  userValidatingForm: FormGroup;

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

    this.userValidatingForm = new FormGroup({
      userFormLogin: new FormControl('', Validators.required),
      userFormName: new FormControl('', Validators.required),
      userFormLastName: new FormControl(''),
      userFormEmail: new FormControl('', Validators.required),
      userFormConfirmEmail: new FormControl('', Validators.required),
      //userFormPassword: new FormControl('', Validators.required),
      userFormCountry: new FormControl(''),
      userFormCity: new FormControl('')
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

  getLogin(log?: string, pass?: string){
    if (log == null){
      log = (<HTMLInputElement>document.getElementById("defaultForm-name")).value;
      pass = (<HTMLInputElement>document.getElementById("defaultForm-pass")).value;
    }

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

  // --- REGISTER COMPONENTS --//
  get userFormLogin() {
    return this.validatingForm.get('loginFormModalName');
  }

  get userFormName() {
    return this.validatingForm.get('userFormName');
  }

  get userFormLastName() {
    return this.validatingForm.get('userFormLastName');
  }

  get userFormEmail() {
    return this.validatingForm.get('userFormEmail');
  }

  get userFormConfirmEmail() {
    return this.validatingForm.get('userFormConfirmEmail');
  }

  /*get userFormPassword() {
    return this.validatingForm.get('userFormPassword');
  }*/
  
  get userFormCountry() {
    return this.validatingForm.get('userFormCountry');
  }
  
  get userFormCity() {
    return this.validatingForm.get('userFormCity');
  }

  generateRandomPassword(){
    let length = 8,
        charset = "abcde0123456789",
        newPassword = "";

    for (var i = 0, n = charset.length; i < length; ++i) {
      newPassword += charset.charAt(Math.floor(Math.random() * n));
    }

    return newPassword;
  }

  register(){
    let newLogin = (<HTMLInputElement>document.getElementById("orangeForm-login")).value;
    let newName = (<HTMLInputElement>document.getElementById("orangeForm-name")).value;
    let newLastName = (<HTMLInputElement>document.getElementById("orangeForm-lastname")).value;
    let newEmail = (<HTMLInputElement>document.getElementById("orangeForm-email")).value;
    let newConfirmEmail = (<HTMLInputElement>document.getElementById("orangeForm-email2")).value;
    let newCountry = (<HTMLInputElement>document.getElementById("orangeForm-country")).value;
    let newCity = (<HTMLInputElement>document.getElementById("orangeForm-city")).value;

    let newPassword = this.generateRandomPassword();

    if (newLogin == "" || newName == "" || newEmail == "" || newConfirmEmail == ""){
      alert("É necessário o preencimento de todos os campos obrigatórios.");
    }
    else if (newEmail != newConfirmEmail){
      alert("Os campos de e-mail e confirmação não coicidem.");
    }
    else {
      this.isLogged = false;
      this.modalRegister.hide();
      let newUser: User = {
        login: newLogin,
        name: newName,
        lastName: newLastName,
        email: newEmail,
        jurisdictionId: 6,
        parentId: 35,
        password: newPassword,
        country: newCountry,
        city: newCity,
        deleted: false,
        commission: 0,
        jurisdiction: null,
        userPermission: null,
        credit: 0,
        id: 0,
        children: null
      }

      this.configService.createUser(newUser)
      .subscribe(data => {
        this.configService.sendPasswordToEmail(newUser.name, newUser.email, newUser.password)
        .subscribe(data => {
          if (data){
            alert("Cadastro realizado com sucesso! Favor acessar seu e-mail para capturar sua senha.");
            //this.getLogin(newUser.login, newUser.password);
            this.ngOnInit();
          }
        }, error => {
          alert("Houve um erro, cadastro não realizado! (" + error +")");
          this.ngOnInit();
          console.log(error);
        })
      }, error =>{
        alert("Houve um erro, cadastro não realizado! (" + error +")");
        this.ngOnInit();
      });
    }
  }

}