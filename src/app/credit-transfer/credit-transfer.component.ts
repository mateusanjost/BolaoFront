import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';
import { AppComponent } from '../app.component';
import { User } from '../user.interface';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-credit-transfer',
  templateUrl: './credit-transfer.component.html',
  styleUrls: ['./credit-transfer.component.scss']
})
export class CreditTransferComponent implements OnInit {

  user: User;
  myUsers: User[] = [];
  ownCredit: string;
  isLoaded: boolean = false;

  constructor(private configService: ConfigService, private appComponent: AppComponent) { }

  ngOnInit() {
    this.listUsers();
    this.user = this.appComponent.userAdmin;
    this.ownCredit = this.user.credit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
  
  listUsers(){
    this.configService.getUsersListByParentId(this.appComponent.userAdmin.id)
    .subscribe(data => {
      this.myUsers = data;
      this.isLoaded = true;
      document.getElementById("spinner-loading").classList.add("hidden");
    });
  }

  onSubmit(form: NgForm){
    let adminNewCredit = this.appComponent.userAdmin.credit;
    let childNewCredit = this.myUsers.find(x => x.id == form.value.jurisdiction).credit;

    if (form.value.operation == 2){
      if (adminNewCredit >= form.value.credit){
        adminNewCredit -= +form.value.credit;
        childNewCredit +=  +form.value.credit;
        this.updateUserCredit(this.appComponent.userAdmin.id, adminNewCredit, form.value.jurisdiction, childNewCredit);
        this.isLoaded = false; // this brings back the loading; when finish operation, will reload this page component
      }
      else {
        alert('Você não tem crédito suficente para esta operação.');
      }
    }
    else {
      if (childNewCredit >= form.value.credit){
        adminNewCredit += +form.value.credit;
        childNewCredit -= +form.value.credit;
        this.updateUserCredit(this.appComponent.userAdmin.id, adminNewCredit, form.value.jurisdiction, childNewCredit);
        this.isLoaded = false; // this brings back the loading; when finish operation, will reload this page component
      }
      else {
        alert('Valor a ser retirado excede o crédito atual do usuário');
      }
    }
  }

  updateUserCredit(adminId: number, creditAdmin: number, childId: number, creditChild: number){    
    this.configService.updateUserCredit(childId, creditChild)
    .subscribe(data => {
      this.configService.updateUserCredit(adminId, creditAdmin)
      .subscribe(data => {
        this.appComponent.userAdmin.credit = creditAdmin;
        alert('Transferência realizada!');
        this.ngOnInit();
      }, error => {
        alert('Erro de conexão na transferência 101');
        console.log(error);
        this.ngOnInit();
      });
    }, error => {
      alert('Erro de conexão na transferência 102');
      console.log(error);
      this.ngOnInit();
    });
  }

}
