import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';
import { AppComponent } from '../app.component';
import { User } from '../user.interface';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  user: User;
  ownCredit: any;
  isLoaded: boolean = false;

  constructor(private configService: ConfigService, private appComponent: AppComponent) { 
    
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

}
