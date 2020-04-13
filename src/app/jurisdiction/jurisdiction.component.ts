import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTreeNestedDataSource} from '@angular/material/tree';
import { Validators, FormBuilder } from '@angular/forms';
import { NestedTreeControl} from '@angular/cdk/tree';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

import { ModalDirective } from 'angular-bootstrap-md';

import { AppComponent } from '../app.component';
import { ConfigService } from '../config.service';

import { User, UserLoginForm } from '../user.interface';
import { Jurisdiction } from '../jurisdiction.interface';
import { TranslateService } from '@ngx-translate/core';

interface JurisdictionNode {
  name: string;
  login: string;
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

  displayedColumns: string[] = ['id', 'login', 'name', 'email'];
  //displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  //dataSource2 = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSource2 = new MatTableDataSource<User>();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

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
    //commission: ['', Validators.required],
    commission: [0],
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

  userSelected: any;

  usersTable: User[] = [];

  constructor(private configService: ConfigService, public appComponent: AppComponent,
    private fb: FormBuilder, private router: Router, private translate: TranslateService) {
      this.translate.setDefaultLang(this.appComponent.activeLang);
     }

  hasChild = (_: number, node: JurisdictionNode) => !!node.children && node.children.length > 0;

  ngOnInit() {
    this.TREE_USERS = [];
    this.isLoaded = false;
    this.senhaOk = false;
    this.emailOk = false;

    this.listTree();    
    this.listJurisdiction();
    this.listUsers();
    this.getUsersTreeList();
    this.dataSource2.paginator = this.paginator;
    this.userEditable = this.appComponent.userAdmin;
    this.userCredit = this.userEditable.credit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }

  getUsersTreeList(){
    this.configService.getUsersTreeList(this.appComponent.userAdmin.id)
    .subscribe(data => {
      this.usersTable = data;
      this.dataSource2.data = data;
    }, error => {
      console.log(error);
      this.appComponent.msgStandard(this.translate.instant("pg-jurisdiction.operation-failed"), this.translate.instant("pg-jurisdiction.operation-failed-info"), 4);
    })
  }

  listUsers(){
    this.configService.getUsersTreeList(this.appComponent.userAdmin.id)
    .subscribe(data => {
      this.treeList = data;
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
        name: this.myUsers.login,
        login: this.myUsers.login,
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

  updateListUsers(jurisdictionLevel: number){
    this.configService.GetJurisdictionLevelByUser(this.appComponent.userAdmin.id, jurisdictionLevel)
    .subscribe(data => {
      this.treeList = data;
      this.treeListRemove = data;
      this.jurisdictionForm.get("parentId").enable();
      this.selectSingleParent();
    }, error => {
      console.log(error);
    });
  }

  addNewUserAdmin(frame) { 
    let newUser: UserLoginForm = {
      email: this.jurisdictionForm.get('email').value,
      jurisdictionId: this.jurisdictionForm.get('jurisdictionId').value,
      login: this.jurisdictionForm.get('login').value,
      commission: this.jurisdictionForm.get('commission').value,
      parentId: this.jurisdictionForm.get('parentId').value,
      password: this.jurisdictionForm.get('password').value,      
      name: this.jurisdictionForm.get('name').value,
      lastName: ""
    }

    this.configService.addNewUser(newUser)
    .subscribe(() => {
      this.appComponent.msgStandard(this.translate.instant("pg-jurisdiction.operation-successfull"), this.translate.instant("pg-jurisdiction.user") + this.jurisdictionForm.get('login').value + this.translate.instant("pg-jurisdiction.successfull-created"), 3);
      this.ngOnInit();
      frame.hide();
    }, error => {
      console.log(error);
      this.appComponent.msgStandard(this.translate.instant("pg-jurisdiction.operation-failed"), this.translate.instant("pg-jurisdiction.operation-failed-info"), 4);
    });
  }

  removeUserAdmin(frame) {    
    this.configService.removeUser(this.jurisdictionToDelete)
    .subscribe((data: User) => {
      //alert("Usuário " +  data.name + " removido com sucesso.");
      this.appComponent.msgStandard(this.translate.instant("pg-jurisdiction.operation-successfull"), this.translate.instant("pg-jurisdiction.user") +  data.name + this.translate.instant("pg-jurisdiction.successfull-deleted"), 3);
      this.ngOnInit();
      frame.hide();
    }, error => {
      this.appComponent.msgStandard(this.translate.instant("pg-jurisdiction.operation-failed"), this.translate.instant("pg-jurisdiction.operation-failed-info"), 4);
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
      if (form.value.userPassword != undefined){
        this.userEditable.password = form.value.userPassword;
      }
      this.userEditable.lastName = form.value.lastName;
      this.userEditable.email = form.value.userEmail;
      this.userEditable.country = form.value.country;
      this.userEditable.city = form.value.city;
      this.configService.updateUser(this.userEditable.id, this.userEditable)
      .subscribe(data => {
        //alert("Dados alterados com sucesso!");
        this.appComponent.msgStandard(this.translate.instant("pg-jurisdiction.edited-successfull"), this.translate.instant("pg-jurisdiction.edited-successfull-info"), 3);
        this.ngOnInit();
      }, error => {
        //alert("Houve algum erro de conexão!");
        this.appComponent.msgStandard(this.translate.instant("pg-jurisdiction.edited-failed"), this.translate.instant("pg-jurisdiction.edited-failed-info"), 4);
        console.log(error);
        this.ngOnInit();
      });
    }
    else {
      //alert("O campo e-mail é obrigatório!");
      this.appComponent.msgStandard(this.translate.instant("pg-jurisdiction.empty-email"), this.translate.instant("pg-jurisdiction.empty-email-info"), 4);
    }
  }

  compararSenha(){
      this.senhaOk = this.jurisdictionForm.get('confirmPassword').value === this.jurisdictionForm.get('password').value;
  }

  emailErrado() {
    this.emailOk = !this.jurisdictionForm.get('email').hasError('email');
  }

  selectSingleParent(){
    if(this.treeList.length == 1){
      this.userSelected = this.treeList[0].id;
    }
  }
  
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];