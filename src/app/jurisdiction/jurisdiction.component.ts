import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTreeNestedDataSource} from '@angular/material/tree';
import { NestedTreeControl} from '@angular/cdk/tree';
import { ModalDirective } from 'angular-bootstrap-md';

import { AppComponent } from '../app.component';
import { ConfigService } from '../config.service';

import { User } from '../user.interface';
import { Jurisdiction } from '../jurisdiction.interface';
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
  treeList: User[];
  jurisdictionForm: JurisdictionForm;
  jurisdictionToDelete: number;
  jurisdictions: Jurisdiction[];
  msgResponse: string = "";
  isLoaded: boolean = false;
  
  TREE_USERS: JurisdictionNode[] = [];
  treeControl = new NestedTreeControl<JurisdictionNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<JurisdictionNode>();

  constructor(private configService: ConfigService, private appComponent: AppComponent) { }

  hasChild = (_: number, node: JurisdictionNode) => !!node.children && node.children.length > 0;

  ngOnInit() {
    this.listTree();    
    this.listJurisdiction();
    this.listUsers();
  }

  listUsers(){
    this.configService.getUsersTreeList(this.appComponent.userAdmin.id)
    .subscribe(data => {
      this.treeList = data;
      console.log(this.treeList);
    }, error => {
      console.log(error);
    });
  }

  listJurisdiction(){
    this.configService.getJurisdictionsById(this.appComponent.userAdmin.jurisdictionId)
    .subscribe(data => {
      this.jurisdictions = data;           
    }, error => {
      console.log(error);
    });
  }

  listTree(){
    this.configService.getUserTree(this.appComponent.userAdmin.id)
    .subscribe(data => {
      this.myUsers = data;

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

  addNewUserAdmin(formSubmit) { 
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

  removeNewUserAdmin(userAdminId) {    
    this.configService.removeUser(userAdminId)
    .subscribe(() => {
      alert("Usuário " + this.jurisdictionForm.login + " removido com sucesso.");
    }, error => {
      console.log(error);
    });
  }  
  
}