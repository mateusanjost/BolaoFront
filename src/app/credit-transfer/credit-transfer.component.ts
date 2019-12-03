import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../config.service';
import { AppComponent } from '../app.component';
import { User } from '../user.interface';
import { NgForm, FormControl } from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-credit-transfer',
  templateUrl: './credit-transfer.component.html',
  styleUrls: ['./credit-transfer.component.scss']
})
export class CreditTransferComponent implements OnInit {
  @ViewChild('frame', { static: true }) modalConfirm: ModalDirective;
  
  
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

  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  constructor(private configService: ConfigService, private appComponent: AppComponent) { }
  
  ngOnInit() {
    this.getUser();
    
    /*this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );*/
  }   
  
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => 
      option.toLowerCase().includes(filterValue)
    );
  }
    
    
  displayFn(subject){
    return subject ? subject : undefined;
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
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.setOwnCredit();
  }

  setOwnCredit(){
    this.ownCredit = this.user.credit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    this.isLoaded = true;
    document.getElementById("spinner-loading").classList.add("hidden");
  }

  onSubmit(form: NgForm){
    this.adminNewCredit = this.appComponent.userAdmin.credit;
    this.childNewCredit = this.myUsers.find(x => x.id == form.value.jurisdiction).credit;
    this.valueToTransfer = (+form.value.credit).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    console.log(this.valueToTransfer);

    if (form.value.operation == 2){
      if (this.adminNewCredit >= form.value.credit){
        this.adminNewCredit -= +form.value.credit;
        this.childNewCredit +=  +form.value.credit;
        this.childId = +form.value.jurisdiction;
        this.childLogin = this.myUsers.find(x => x.id == this.childId).login;
        this.transferType = "Creditar";
        //this.updateUserCredit(this.appComponent.userAdmin.id, adminNewCredit, form.value.jurisdiction, childNewCredit);
        this.showConfirmModal();
        //this.isLoaded = false; // this brings back the loading; when finish operation, will reload this page component
      }
      else {
        //alert('Você não tem crédito suficente para esta operação.');
        this.appComponent.msgStandard("Operação Não Realizada", "Você não tem crédito suficente para esta operação.", 4);
      }
    }
    else {
      if (this.childNewCredit >= form.value.credit){
        this.adminNewCredit += +form.value.credit;
        this.childNewCredit -= +form.value.credit;
        this.childId = +form.value.jurisdiction;
        this.childLogin = this.myUsers.find(x => x.id == this.childId).login;
        this.transferType = "Retirar";
        //this.updateUserCredit(this.appComponent.userAdmin.id, adminNewCredit, form.value.jurisdiction, childNewCredit);
        this.showConfirmModal();
        //this.isLoaded = false; // this brings back the loading; when finish operation, will reload this page component
      }
      else {
        //alert('Valor a ser retirado excede o crédito atual do usuário');
        this.appComponent.msgStandard("Nâo Permitido", "Valor a ser retirado excede o crédito atual do usuário.", 4);
      }
    }
  }

  showConfirmModal(){
    this.modalConfirm.show();
  }

  confirmTransfer(){
    this.isLoaded = false;
    this.modalConfirm.hide();
    this.updateUserCredit(this.appComponent.userAdmin.id, this.adminNewCredit, this.childId, this.childNewCredit);
  }

  updateUserCredit(adminId: number, creditAdmin: number, childId: number, creditChild: number){    
    this.configService.updateUserCredit(childId, creditChild)
    .subscribe(data => {
      this.configService.updateUserCredit(adminId, creditAdmin)
      .subscribe(data => {
        this.appComponent.userAdmin.credit = creditAdmin;
        //alert('Transferência realizada!');
        this.appComponent.msgStandard("Transferência Realizada", "Valor transferido com sucesso.", 3);
        this.ngOnInit();
      }, error => {
        //alert('Erro de conexão na transferência 101');
        this.appComponent.msgStandard("Transferência Não Realizada", "Erro na realização da transferência.", 4);
        console.log(error);
        this.ngOnInit();
      });
    }, error => {
      //alert('Erro de conexão na transferência 102');
      this.appComponent.msgStandard("Transferência Não Realizada", "Erro na realização da transferência.", 4);
      console.log(error);
      this.ngOnInit();
    });
  }

}
