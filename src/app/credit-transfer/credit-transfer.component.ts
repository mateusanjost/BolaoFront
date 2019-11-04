import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';
import { AppComponent } from '../app.component';
import { User } from '../user.interface';

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
    this.user = this.appComponent.userAdmin;
    this.ownCredit = this.user.credit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    this.listUsers();
  }
  
  listUsers(){
    this.configService.getUsersListByParentId(this.appComponent.userAdmin.id)
    .subscribe(data => {
      this.myUsers = data;
      this.isLoaded = true;
      document.getElementById("spinner-loading").classList.add("hidden");
    });
  }

}
