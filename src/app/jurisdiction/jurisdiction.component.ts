import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTreeNestedDataSource} from '@angular/material/tree';
import { Validators, FormBuilder } from '@angular/forms';
import { NestedTreeControl} from '@angular/cdk/tree';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { ModalDirective } from 'angular-bootstrap-md';

import { AppComponent } from '../app.component';
import { ConfigService } from '../config.service';

import { User, UserLoginForm } from '../user.interface';
import { Jurisdiction } from '../jurisdiction.interface';

interface JurisdictionNode {
  name: string;
  jurisdictionId: number;
  id: number;
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
  @ViewChild('frame3', { static: true }) modalEdit: ModalDirective;

  myUsers: User;
  treeList: User[];
  treeListRemove: User[];
  jurisdictionToDelete: number;
  jurisdictions: Jurisdiction[];
  msgResponse: string = "";
  isLoaded: boolean = false;
  senhaOk: boolean = false;
  emailOk: boolean = false;

  userEditable: User;
  showPassword: boolean = false;
  userCredit: string;

  jurisdictionForm = this.fb.group({
    jurisdictionId: ['', Validators.required],
    login: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    email: ['', [Validators.required,Validators.email] ] ,
    parentId: ['', Validators.required],
    obs: [''],
    name: ['', Validators.required]
  });
  
  TREE_USERS: JurisdictionNode[] = [];
  treeControl = new NestedTreeControl<JurisdictionNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<JurisdictionNode>();

  constructor(private configService: ConfigService, private appComponent: AppComponent, private fb: FormBuilder, private router: Router) { }

  hasChild = (_: number, node: JurisdictionNode) => !!node.children && node.children.length > 0;

  ngOnInit() {
    this.TREE_USERS = [];
    this.isLoaded = false;
    this.senhaOk = false;
    this.emailOk = false;

    this.listTree();    
    this.listJurisdiction();
    this.listUsers();
    this.userEditable = this.appComponent.userAdmin;
    this.userCredit = this.userEditable.credit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  listUsers(){
    this.configService.getUsersTreeList(this.appComponent.userAdmin.id)
    .subscribe(data => {
      this.treeList = data.filter(x => x.jurisdictionId != 6); // remove club
      this.treeListRemove = data;
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
        id: this.myUsers.id,
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

  addNewUserAdmin(frame) { 
    let newUser: UserLoginForm = {
      email: this.jurisdictionForm.get('email').value,
      jurisdictionId: this.jurisdictionForm.get('jurisdictionId').value,
      login: this.jurisdictionForm.get('login').value,
      //obs: this.jurisdictionForm.get('obs').value,
      parentId: this.jurisdictionForm.get('parentId').value,
      password: this.jurisdictionForm.get('password').value,      
      name: this.jurisdictionForm.get('name').value,
      lastName: ""
    }

    this.configService.addNewUser(newUser)
    .subscribe(() => {
      alert("Usuário " + this.jurisdictionForm.get('login').value + " criado com sucesso.");
      this.ngOnInit();
      frame.hide();
    }, error => {
      console.log(error);
    });
  }

  removeUserAdmin(frame) {    
    this.configService.removeUser(this.jurisdictionToDelete)
    .subscribe((data: User) => {
      alert("Usuário " +  data.name + " removido com sucesso.");
      this.ngOnInit();
      frame.hide();
    }, error => {
      console.log(error);
    });
  }  

  editJurisdiction(userId: number){
    if (userId == this.appComponent.userAdmin.id){
      this.router.navigate(['/settings']);
    }
    else {
      this.configService.getUser(userId)
      .subscribe(data => {
        this.userEditable = data;
        this.userCredit = data.credit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        this.modalEdit.show();
      }, error => {
        console.log(error);
      });
    }
  }

  showPasswordField(){
    this.showPassword = true;
  }

  editUser(form: NgForm){
    if (form.value.userEmail != ""){
      this.modalEdit.hide();
      this.isLoaded = false;
      this.userEditable.name = form.value.userName;
      if (form.value.userPassword != ""){
        this.userEditable.password = form.value.userPassword;
      }
      this.userEditable.lastName = form.value.lastName;
      this.userEditable.email = form.value.userEmail;
      this.userEditable.country = form.value.country;
      this.userEditable.city = form.value.city;
      this.configService.updateUser(this.userEditable.id, this.userEditable)
      .subscribe(data => {
        alert("Dados alterados com sucesso!");
        this.ngOnInit();
      }, error => {
        alert("Houve algum erro de conexão!");
        console.log(error);
        this.ngOnInit();
      });
    }
    else {
      alert("O campo e-mail é obrigatório!");
    }
  }

  compararSenha(){
      this.senhaOk = this.jurisdictionForm.get('confirmPassword').value === this.jurisdictionForm.get('password').value;
  }

  emailErrado() {
    this.emailOk = !this.jurisdictionForm.get('email').hasError('email');
  }
  
}