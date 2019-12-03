import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../config.service';
import { AppComponent } from '../app.component';
import { User } from '../user.interface';
import { NgForm } from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @ViewChild('frame', { static: true }) modalUser: ModalDirective;
  @ViewChild('frame2', { static: true }) modalPassword: ModalDirective;

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

  closeModalPassword(){
    this.modalPassword.hide();
  }

  closeModalUser(){
    this.modalUser.hide();
  }

  changePassword(form: NgForm){
    if (form.value.currentPassword == this.user.password && form.value.newPassword == form.value.confirmPassword){
      this.modalPassword.hide();
      this.isLoaded = false;
      this.user.password = form.value.newPassword;
      this.configService.updateUser(this.user.id, this.user)
      .subscribe(data => {
        //alert("Senha alterada com sucesso!");
        this.appComponent.msgStandard("Alteração Realizada", "Senha alterada com sucesso!", 3);
        this.ngOnInit();
      }, error => {
        //alert("Houve algum erro de conexão!");
        this.appComponent.msgStandard("Erro na Alteração", "Houve algum erro na edição!", 4);
        console.log(error);
        this.ngOnInit();
      });
    }
    else {
      //alert("As senhas não coicidem!");
      this.appComponent.msgStandard("Senhas Imcompatíveis", "As senhas não coicidem!", 4);
    }
  }

  editUser(form: NgForm){
    if (form.value.userName != "" && form.value.userEmail != ""){
      this.modalUser.hide();
      this.isLoaded = false;
      this.user.name = form.value.userName;
      this.user.lastName = form.value.lastName;
      this.user.email = form.value.userEmail;
      this.user.country = form.value.country;
      this.user.city = form.value.city;
      this.configService.updateUser(this.user.id, this.user)
      .subscribe(data => {
        //alert("Dados alterados com sucesso!");
        this.appComponent.msgStandard("Alteração Realizada", "Dados alterados com sucesso!", 3);
        this.ngOnInit();
      }, error => {
        //alert("Houve algum erro de conexão!");
        this.appComponent.msgStandard("Erro na Alteração", "Houve algum erro durante o processamento da requisição.", 4);
        console.log(error);
        this.ngOnInit();
      });
    }
    else {
      //alert("Existem campos obrigatórios vazios!");
      this.appComponent.msgStandard("Campos Obrigatório Vazio", "Existe campo obrigatório não preenchido!", 4);
    }
  }

}
