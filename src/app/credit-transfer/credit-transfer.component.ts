import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../config.service';
import { AppComponent } from '../app.component';
import { User } from '../user.interface';
import { NgForm, FormControl, FormGroup, Validators } from '@angular/forms';
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

  //myControl = new FormControl();
  formTransfer: FormGroup;
  filteredOptions: Observable<User[]>;

  creditVisibility: boolean = false;

  constructor(private configService: ConfigService, private appComponent: AppComponent) { }
  
  ngOnInit() {
    this.getUser();
    
    this.formTransfer = new FormGroup({
      myControl: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      credit: new FormControl('', Validators.required)
    });
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
    const filterValue = name.toLowerCase();

    return this.myUsers.filter(option => option.login.toLowerCase().indexOf(filterValue) === 0);
  }

  displayFn(user?: User): string | undefined {
    //return user ? user.login : undefined;
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
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.login),
        map(login => login ? this._filter(login) : this.myUsers.slice())
      );
    this.setOwnCredit();
  }

  setOwnCredit(){
    this.ownCredit = this.user.credit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    this.isLoaded = true;
    document.getElementById("spinner-loading").classList.add("hidden");
  }

  onSubmit(){
    //console.log("juris " + this.formTransfer.value.myControl.id);
    this.adminNewCredit = this.appComponent.userAdmin.credit;
    this.childNewCredit = this.myUsers.find(x => x.id == this.formTransfer.value.myControl.id).credit;
    this.valueToTransfer = (+this.formTransfer.value.credit).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    if (this.formTransfer.value.type == 2){
      if (this.adminNewCredit >= this.formTransfer.value.credit){
        this.adminNewCredit -= +this.formTransfer.value.credit;
        this.childNewCredit +=  +this.formTransfer.value.credit;
        this.childId = +this.formTransfer.value.myControl.id;
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
      if (this.childNewCredit >= this.formTransfer.value.credit){
        this.adminNewCredit += +this.formTransfer.value.credit;
        this.childNewCredit -= +this.formTransfer.value.credit;
        this.childId = +this.formTransfer.value.myControl.id;
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

  toggleVisibility(){
    this.creditVisibility = !this.creditVisibility;
  }

}
