import { Component, ViewChild, Injectable } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { FormControl, FormGroup, Validators} from "@angular/forms";
import { ConfigService } from './config.service';
import { Login } from './login.interface';
import { CookieService } from 'ngx-cookie-service';
import { User, UserLoginForm } from './user.interface';
import { TranslateService } from '@ngx-translate/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import * as $ from "jquery";
import { HomeComponent } from './home/home.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpInterceptor } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})




export class AppComponent {
  
  @ViewChild('frame', { static: true }) modalLogin: ModalDirective;
  @ViewChild('frame2', { static: true }) modalForgot: ModalDirective;
  @ViewChild('frame3', { static: true }) modalRegister: ModalDirective;
  @ViewChild('frameMessage', { static: true }) modalMessages: ModalDirective;
  msgToAdd: string = "";
  titleToAdd: string = "";
  msgType: string[] = [ "", "modal-primary", "modal-warning", "modal-success", "modal-danger" ];

  title = 'mdb-angular-free';
  validatingForm: FormGroup;
  userValidatingForm: FormGroup;
  forgotValidatingForm: FormGroup;

  registerLoading: boolean = false;

  public isLogged: boolean = false;
  userAdmin: any;
  public messagesBadge: number;
  public warningBadge: number;
  // lang: number = 0;
  // languageImgs: string[] = ["ptbr.png", "gb.png", "es.png", "it.png"];
  public activeLang = 'pt';

  public cookie: string;
  public betIdPrint: number;

  public selectedItem: any;

  constructor(private configService: ConfigService, private cookieService: CookieService,
    private translate: TranslateService, private router: Router){ 
    this.translate.setDefaultLang(this.activeLang);
  }

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
      userFormCountry: new FormControl(''),
      userFormCity: new FormControl('')
    });

    this.forgotValidatingForm = new FormGroup({
      forgotFormEmail: new FormControl('', [Validators.required, Validators.email])
    });

    this.configService.getUnreadMessages()
    .subscribe(data => {
      this.messagesBadge = data.length;
    }, error => {
    
    });
  
  
    this.checkWarnings();

    if(this.cookieService.get('user') != null && this.cookieService.get('user') != ""){
// MOEDA LOGADO
var idioma1 = document.documentElement.lang;
  
switch (idioma1) {
  case 'pt-BR':
    this.changeLanguage('pt');
    console.log("Idioma padrão " + idioma1);
    break;
    case 'en':
      this.changeLanguage('en');
      console.log("Idioma padrão " + idioma1);
      break;
      case 'es':
        this.changeLanguage('es');
        console.log("Idioma padrão " + idioma1);
        break;
        case 'it':
          this.changeLanguage('it');
          console.log("Idioma padrão " + idioma1);
          break;
          default:
console.log('Sorry, not supported ' + idioma1 + '.');

}

    }else{
   // MOEDA SEM ESTAR LOGADO
   var idioma2 = navigator.language;
     
   switch (idioma2) {
     case 'pt-BR':
       this.changeLanguage('pt');
       console.log("Idioma padrão " + idioma2);
       break;
       case 'en':
         this.changeLanguage('en');
         console.log("Idioma padrão " + idioma2);
         break;
         case 'es':
           this.changeLanguage('es');
           console.log("Idioma padrão " + idioma2);
           break;
           case 'it':
             this.changeLanguage('it');
             console.log("Idioma padrão " + idioma2);
             break;
             default:
 console.log('Sorry, not supported ' + idioma2 + '.');
   
   }

  }
    if(this.cookieService.get('user') != null && this.cookieService.get('user') != ""){
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
      this.checkCredit();
      this.router.navigate(['/logged/2020']);
    }, error =>{
      console.log(error);
      this.msgStandard(this.translate.instant('pg-app-component.error-login'), this.translate.instant('pg-app-component.wrong-user-password'), 4);
    });

    (<HTMLInputElement>document.getElementById("defaultForm-name")).value = "";
    (<HTMLInputElement>document.getElementById("defaultForm-pass")).value = "";

    this.modalLogin.hide();

  }

  checkCredit() {
    if(this.userAdmin.credit < 10){
      this.msgStandard(this.translate.instant('pg-app-component.log-credit'), this.translate.instant('pg-app-component.log-credit-info'), 4);
    }
  }

  checkWarnings(){
    this.configService.getRoundsFinished()
    .subscribe(data => {
      this.warningBadge = data.length;
    }, error => {
      console.log(error);
    });
  }

  showWarnings(){
    this.msgStandard(this.translate.instant('pg-app-component.result-to-publish'), this.translate.instant('pg-app-component.there-are') +
     this.warningBadge + this.translate.instant('pg-app-component.to-be-published')+
    " <a href='post-result'>" + this.translate.instant('pg-app-component.click-here') + "</a> " +
    this.translate.instant('pg-app-component.to-resolve'), 2);
  }

  logout(){
    this.cookieService.deleteAll();
    this.isLogged = false;
    this.userAdmin =  null;

  }

  forgetPassword(){
    this.modalLogin.hide();
    this.modalForgot.show();
  }

  sendLogin(){
    if (!this.forgotValidatingForm.get("forgotFormEmail").valid){
      //alert("Campo de e-mail inválido");
      this.msgStandard(this.translate.instant('pg-app-component.invalid-email'), this.translate.instant('pg-app-component.email-not-found'), 4);

    }
    else {
      this.modalForgot.hide();
      this.isLogged = false;
      this.configService.sendRecoveryPassword(this.forgotValidatingForm.get("forgotFormEmail").value)
      .subscribe(data => {
        //alert("Credenciais enviadas! Cheque se e-mail.");
        this.msgStandard(this.translate.instant('pg-app-component.register-success'), this.translate.instant('pg-app-component.sent-credentials'), 3);
        this.ngOnInit();
      }, error => {
        //alert("Não enviado ("+ error.error +").");
        this.msgStandard(this.translate.instant('pg-app-component.not-sent'), this.translate.instant('pg-app-component.not-sent-info') + " (" + error.error + ")", 4);
        this.ngOnInit();
      })
    }
  }
  // --- LOGIN COMPONENTS --- //

  // --- REGISTER COMPONENTS --//
  get userFormLogin() {
    return this.userValidatingForm.get('userFormLogin');
  }

  get userFormName() {
    return this.userValidatingForm.get('userFormName');
  }

  get userFormLastName() {
    return this.userValidatingForm.get('userFormLastName');
  }

  get userFormEmail() {
    return this.userValidatingForm.get('userFormEmail');
  }

  get userFormConfirmEmail() {
    return this.userValidatingForm.get('userFormConfirmEmail');
  }

  /*get userFormPassword() {
    return this.validatingForm.get('userFormPassword');
  }*/

  get userFormCountry() {
    return this.userValidatingForm.get('userFormCountry');
  }

  get userFormCity() {
    return this.userValidatingForm.get('userFormCity');
  }

  get forgotFormEmail() {
    return this.forgotValidatingForm.get('forgotFormEmail');
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

    if (newLogin == "" || /*newName == "" ||*/ newEmail == "" || newConfirmEmail == ""){
      //alert("É necessário o preencimento de todos os campos obrigatórios.");
      this.msgStandard(this.translate.instant('pg-app-component.field-required'), this.translate.instant('pg-app-component.field-required-info'), 4);
    }
    else if (newEmail != newConfirmEmail){
      //alert("Os campos de e-mail e confirmação não coicidem.");
      this.msgStandard(this.translate.instant('pg-app-component.email-not-match'), this.translate.instant('pg-app-component.email-not-match-info'), 4);
    }
    else {
      this.registerLoading = true;
      let newUser: User = {
        login: newLogin,
        name: newName,
        lastName: newLastName,
        email: newEmail,
        jurisdictionId: 7,
        parentId: 66,
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
        this.configService.sendPasswordToEmail(newUser.name, newUser.login, newUser.email, newUser.password)
        .subscribe(data => {
          if (data){
            this.msgStandard(this.translate.instant('pg-app-component.successfull-register'), this.translate.instant('pg-app-component.successfull-register-info'), 3);
            this.modalRegister.hide();
            this.registerLoading = false;
          }
        }, error => {
          this.msgStandard(this.translate.instant('pg-app-component.erro-on-register'), this.translate.instant('pg-app-component.erro-on-register-info'), 4);
          this.modalRegister.hide();
          this.registerLoading = false;
          console.log(error);
        })
      }, error =>{
        this.msgStandard(this.translate.instant('pg-app-component.erro-on-register'), this.translate.instant('pg-app-component.erro-on-register-info'), 4);
        this.modalRegister.hide();
        this.registerLoading = false;
      });
    }
  }

  // --- REGISTER COMPONENTS --//



  // --- LANGUAGE COMPONENTS --//

  public changeLanguage(lang) {
    this.activeLang = lang;
    this.translate.use(lang);

  }
  // --- LANGUAGE COMPONENTS --//

 // --- OPCAO MOBILE FOR DESKTOP  ---//


  funt(){
   close(); 
    var myWindow = window.open("/", "", "width=1366,height=357");
    window.close();
     }
  // --- MSG COMMON MODAL ---//

  msgStandard(title: string, msg: string, type?: number){
    this.titleToAdd = title;
    this.msgToAdd = msg;

    for (let i = 1; i < this.msgType.length; i++){
      document.getElementById('msgModalStandard').classList.remove(this.msgType[i]);
    }
    if (type != 0){
      document.getElementById('msgModalStandard').classList.add(this.msgType[type]);
    }

    this.modalMessages.show();
  }

  listClick(event){
    console.log(event.currentTarget.id);
    if(document.getElementsByClassName('button-header').length > 0) 
      document.getElementsByClassName('button-header')[0].classList.remove('button-header');
    document.getElementById(event.currentTarget.id).classList.add('button-header');
  }

}


