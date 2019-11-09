import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { NestedTreeControl} from '@angular/cdk/tree';
import { MatTreeNestedDataSource} from '@angular/material/tree';

import { User } from '../user.interface';
import { ConfigService } from '../config.service';
import { AppComponent } from '../app.component';
import { JurisdictionForm } from '../JurisdictionForm.interface';

interface JurisdictionNode {
  name: string;
  jurisdictionId: number;
  children?: JurisdictionNode[];
}

@Component({
  selector: 'app-jurisdiction',
  templateUrl: './jurisdiction.component.html',
  styleUrls: ['./jurisdiction.component.scss']
})
export class JurisdictionComponent implements OnInit {
  @ViewChild('frame', { static: true }) modalCreate: ModalDirective;
  @ViewChild('frame2', { static: true }) modalDelete: ModalDirective;

  myUsers: User;
  TREE_USERS: JurisdictionNode[] = [];
  
  jurisdicoesPai: Array<any>;
  jurisdictionForm: JurisdictionForm;

  msgResponse: string = "";

  isLoaded: boolean = false;

  treeControl = new NestedTreeControl<JurisdictionNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<JurisdictionNode>();

  constructor(private configService: ConfigService, private appComponent: AppComponent) {
    this.jurisdicoesPai = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
      { value: '3', label: 'Option 3' }
    ];
  }

  hasChild = (_: number, node: JurisdictionNode) => !!node.children && node.children.length > 0;

  ngOnInit() {
    this.listUsers();    
  }

  listUsers(){
    this.configService.listUsersByParentId(this.appComponent.userAdmin.id)
    .subscribe(data => {
      this.myUsers = data;
      console.log(this.myUsers); //fazer map de user pra jurisdictionNode?

      this.TREE_USERS.push({
        name: this.myUsers.name,
        jurisdictionId: this.myUsers.jurisdictionId,
        children: this.myUsers.children
      });

      this.dataSource.data = this.TREE_USERS;

      document.getElementById("spinner-loading").classList.add("hidden");
      this.isLoaded = true;

    }, error =>{
      console.log(error);
    });
  }

  confirmDelete(){
    let jurisdiction = (<HTMLInputElement>document.getElementById("jurisdiction")).value;

    if (jurisdiction == ""){
      alert("Necessário escolher jurisdição que deseja excluir.");
    }
    else {
      alert("Jurisdição deletada com sucesso!");
      this.modalDelete.hide();
    }

  }

  onSubmit(formSubmit,) { 
    this.jurisdictionForm = {
      email: formSubmit.email,
      jurisdictionId: formSubmit.jurisdictionId,
      login: formSubmit.login,
      obs: formSubmit.obs,
      parentId: formSubmit.parentId,
      password: formSubmit.password
    }

    this.configService.addNewUser(this.jurisdictionForm)
    .subscribe(() => {
      alert("Usuário " + this.jurisdictionForm.login + " criado com sucesso.");
    }, error => {
      console.log(error);
    });
  }

  confirmCreate(){
    let login = (<HTMLInputElement>document.getElementById("login")).value;
    let password = (<HTMLInputElement>document.getElementById("password")).value;
    let confirmPassword = (<HTMLInputElement>document.getElementById("confirm-password")).value;
    let email = (<HTMLInputElement>document.getElementById("email")).value;
    let father = (<HTMLInputElement>document.getElementById("father")).value;
    
    if (login == "" || password == "" || confirmPassword == "" || email == "" || father == "" ){
      this.msgResponse = "Os campos login, senha, confirmação de senha, e-mail e pai são obrigatórios!";
      alert(this.msgResponse);
    } else if (password != confirmPassword){
      this.msgResponse = "A senha e a confirmação de senha não correspondem!";
      alert(this.msgResponse);
    }
    else {
      this.msgResponse = "Jurisdição criada com sucesso!";

      alert(this.msgResponse);

      (<HTMLInputElement>document.getElementById("login")).value = "";
      (<HTMLInputElement>document.getElementById("password")).value = "";
      (<HTMLInputElement>document.getElementById("confirm-password")).value = "";
      (<HTMLInputElement>document.getElementById("email")).value = "";
      (<HTMLInputElement>document.getElementById("father")).value = "";

      this.modalCreate.hide();

    }

    this.msgResponse = "";

  }
  
}