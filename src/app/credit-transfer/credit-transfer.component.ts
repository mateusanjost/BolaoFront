import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../config.service';
import { AppComponent } from '../app.component';
import { User } from '../user.interface';
import { NgForm, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { MatAutocompleteTrigger } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-credit-transfer',
  templateUrl: './credit-transfer.component.html',
  styleUrls: ['./credit-transfer.component.scss']
})
export class CreditTransferComponent implements OnInit {
  @ViewChild('frame', { static: true }) modalConfirm: ModalDirective;
  @ViewChild('myControl', { read: MatAutocompleteTrigger, static: true }) trigger: MatAutocompleteTrigger;
  
  user: User;
  myUsers: User[] = [];
  ownCredit: string;
  isLoaded: boolean = false;
  
  adminNewCredit: number;
  childNewCredit: number;
  childId: number;
  childLogin: string;
  valueToTransfer: string;
  transferType: string = "";
  
  options: string[] = [];
  juris: number[] = [];

  //myControl = new FormControl();
  formTransfer: FormGroup;
  filteredOptions: Observable<User[]>;
  showAutocomplete: boolean = false;
  userChoosen: any;
  userCredit: string = "";

  creditVisibility: boolean = false;

  constructor(private configService: ConfigService, private appComponent: AppComponent, private router: Router,
    private translate: TranslateService) {
      this.translate.setDefaultLang(this.appComponent.activeLang);
   }
  
  ngOnInit() {
    this.getUser();
    
    this.formTransfer = new FormGroup({
      myControl: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      credit: new FormControl('', Validators.required)
    });

    this.userCredit = "";
  }
  
  get myControl() {
    return this.formTransfer.get('myControl');
  }

  get type() {
    return this.formTransfer.get('type');
  }

  get credit() {
    return this.formTransfer.get('credit');
  }

  private _filter(name: string): User[] {
    console.log("parte B");

    const filterValue = name.toLowerCase();

    return this.myUsers.filter(option => option.login.toLowerCase().indexOf(filterValue) === 0);
  }

  displayFn(user?: User): string | undefined {
    //return user ? user.login : undefined;
    console.log("parte A");
    return user ? (user.login + " " + user.credit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })) : undefined;
  }
  
  getUser(){
    this.configService.getUser(this.appComponent.userAdmin.id)
    .subscribe(data => {
      this.user = data;
      this.listUsers();
    }, error => {
      console.log(error);
    });
  }

  listUsers(){
    this.configService.getUsersTreeList(this.appComponent.userAdmin.id)
    .subscribe(data => {
      this.myUsers = data;
      this.setOptions();
    }, error => {
      console.log(error);
    });
  }

  setOptions(){
    this.myUsers.forEach(element => {
      let elementCredit = element.credit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      this.options.push(element.login + " " + elementCredit);
      this.juris.push(element.id);
    });
    this.setFilteredOptions();
  }

  setFilteredOptions(){
    console.log("parte C");
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.login),
        map(login => login ? this._filter(login) : this.myUsers.slice())
      );
    this.setOwnCredit();
  }

  updatedVal(e) {
    //console.log(this.stateCtrl);
    //debugger;
    this.userCredit = "";
    if(e && e.length >= 1) {
      this.showAutocomplete = true;
    } else {
      this.showAutocomplete = false;
    }
  }

  getSelectedOption(id: number){
    this.userChoosen = this.myUsers.filter(x => x.id == id);
    this.userCredit = this.userChoosen[0].credit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  setOwnCredit(){
    this.ownCredit = this.user.credit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    this.isLoaded = true;
    document.getElementById("spinner-loading").classList.add("hidden");
  }

  onSubmit(){
    this.adminNewCredit = this.appComponent.userAdmin.credit;
    //this.childNewCredit = this.myUsers.find(x => x.id == this.formTransfer.value.myControl.id).credit;
    this.childNewCredit = this.myUsers.find(x => x.id == this.userChoosen[0].id).credit;
    this.valueToTransfer = (+this.formTransfer.value.credit).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    if (this.formTransfer.value.type == 2){
      if (this.adminNewCredit >= this.formTransfer.value.credit){
        this.adminNewCredit -= +this.formTransfer.value.credit;
        this.childNewCredit +=  +this.formTransfer.value.credit;
        //this.childId = +this.formTransfer.value.myControl.id;
        this.childId = this.userChoosen[0].id;
        this.childLogin = this.myUsers.find(x => x.id == this.childId).login;
        this.transferType = this.translate.instant("pg-credit-transfer.withdraw");
        this.showConfirmModal();
      }
      else {
        this.appComponent.msgStandard(this.translate.instant("pg-credit-transfer.operation-failed"), this.translate.instant("pg-credit-transfer.operation-failed-info"), 4);
      }
    }
    else {
      if (this.childNewCredit >= this.formTransfer.value.credit){
        this.adminNewCredit += +this.formTransfer.value.credit;
        this.childNewCredit -= +this.formTransfer.value.credit;
        //this.childId = +this.formTransfer.value.myControl.id;
        this.childId = this.userChoosen[0].id;
        this.childLogin = this.myUsers.find(x => x.id == this.childId).login;
        this.transferType = this.translate.instant("pg-credit-transfer.deposit");
        this.showConfirmModal();
      }
      else {
        this.appComponent.msgStandard(this.translate.instant("pg-credit-transfer.not-allowed"), this.translate.instant("pg-credit-transfer.not-allowed-info"), 4);
      }
    }
  }

  showConfirmModal(){
    this.modalConfirm.show();
  }

  confirmTransfer(){
    this.isLoaded = false;
    this.modalConfirm.hide();
    this.updateUserCredit(this.appComponent.userAdmin.id, this.childId, this.formTransfer.value.credit, this.formTransfer.value.type);
  }

  updateUserCredit(fromUserId: number, toUser: number, creditToTransfer: number, transactionType: number){    
      this.configService.updateUserCredit(fromUserId, creditToTransfer, transactionType, toUser)
      .subscribe(data => {
        this.appComponent.userAdmin.credit = creditToTransfer;
        this.appComponent.msgStandard(this.translate.instant("pg-credit-transfer.transfer-done"), this.translate.instant("pg-credit-transfer.transfer-done-info"), 3);
        this.ngOnInit();
      }, error => {
        this.appComponent.msgStandard(this.translate.instant("pg-credit-transfer.transfer-failed"), this.translate.instant("pg-credit-transfer.transfer-failed-info"), 4);
        console.log(error);
        this.ngOnInit();
      });
  }

  toggleVisibility(){
    this.creditVisibility = !this.creditVisibility;
  }

}
