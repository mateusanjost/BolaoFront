import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

import { User } from '../user.interface';
import { ConfigService } from '../config.service';
import { AppComponent } from '../app.component';
//import { ConsoleReporter } from 'jasmine';

interface FoodNode {
  name: string;
  level: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Casino',
    level: '1',
    children: [
      {
        name: 'naBrasil',
        level: '2',
        children: [
          {
            name: 'reSudeste',
            level: '3',
            children: [ {
              name: 'diRJ',
              level: '4',
              children: [{
                name: 'loRJ',
                level: '5',
                children: [
                  {name: 'clRio', level: '6'},
                  {name: 'clAgencia01', level: '6'},
                ]
              }]
          }]
        },
          {name: 'reNorte',
          level: '3',
          children: [
            {name: 'diManaus',
            level: '4',
            children: [
              {name: 'loManaus',
              level: '5',
              children: [
                {name: 'clMN', level: '6'}
              ]}
          ]}
        ]},
        ]
      },
    ]
  },
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  jurisdictionId: number;
}

interface JurisdictionNode {
  name: string;
  jurisdictionId: number;
  children?: JurisdictionNode[];
}

@Component({
  selector: 'app-jurisdiction',
  templateUrl: './jurisdiction.component.html',
  //template: '<tree-root [nodes]="nodes" [options]="options"></tree-root>',
  styleUrls: ['./jurisdiction.component.scss']
})
export class JurisdictionComponent implements OnInit {
  @ViewChild('frame', { static: true }) modalCreate: ModalDirective;
  @ViewChild('frame2', { static: true }) modalDelete: ModalDirective;

  private _transformer = (node: JurisdictionNode, jurisdictionId: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      jurisdictionId: jurisdictionId,
    };
  }

  //myUsers = new Array<User>();
  myUsers: User;
  TREE_USERS: JurisdictionNode[] = [];
  // TREE_USERS: JurisdictionNode[] = [
  //   { 
  //     name: "Casino",
  //     jurisdictionId: 1
  //   }
  // ];

  treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.jurisdictionId, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.jurisdictionId, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  /*nodes = [
    {
      id: 1,
      name: 'root1',
      children: [
        { id: 2, name: 'child1' },
        { id: 3, name: 'child2' }
      ]
    },
    {
      id: 4,
      name: 'root2',
      children: [
        { id: 5, name: 'child2.1' },
        {
          id: 6,
          name: 'child2.2',
          children: [
            { id: 7, name: 'subsub' }
          ]
        }
      ]
    }
  ];
  options = {};*/

  msgResponse: string = "";

  isLoaded: boolean = false;

  constructor(private configService: ConfigService, private appComponent: AppComponent) {
    //this.dataSource.data = TREE_DATA;
    this.dataSource.data = this.TREE_USERS;
    //this.dataSource.data = this.listUsers();
  }

  ngOnInit() {
    this.listUsers();
    // for (let i = this.myUsers.length; i > 1; i--){
    //   this.TREE_USERS[i].name = this.myUsers[i].name;
    //   this.TREE_USERS[i].jurisdictionId = this.myUsers[i].jurisdictionId;
    // }

    /*this.TREE_USERS;*/
    //this.dataSource.data = this.listUsers();
    // this.TREE_USERS = [
    //   { 
    //     name: "Kiko",
    //     jurisdictionId: 1,
    //     children: [
    //       {
    //         name: "Dido",
    //         jurisdictionId: 2
    //       }
    //     ]
    //   }
    // ];
    // this.dataSource.data = this.TREE_USERS;
  }

  listUsers(){
    this.configService.listUsersByParentId(this.appComponent.userAdmin.id) // passar o id do usuário logado
    .subscribe(data => {
      this.myUsers = data;
      console.log(this.myUsers);

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

  confirmCreate(){
    let login = (<HTMLInputElement>document.getElementById("login")).value;
    let password = (<HTMLInputElement>document.getElementById("password")).value;
    let confirmPassword = (<HTMLInputElement>document.getElementById("confirm-password")).value;
    let email = (<HTMLInputElement>document.getElementById("email")).value;
    let father = (<HTMLInputElement>document.getElementById("father")).value;
    
    if (login == "" || password == "" || confirmPassword == "" || email == "" || father == "" ){
      this.msgResponse = "Os camops login, senha, confirmação de senha, e-mail e pai são obrigatórios!";
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