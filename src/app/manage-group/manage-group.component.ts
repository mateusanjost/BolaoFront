import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';
import { RoundGroup } from '../round-group.interface';
import { AppComponent } from '../app.component';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';

interface FoodNode {
  name: string;
  childrens?: FoodNode[];
}

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-manage-group',
  templateUrl: './manage-group.component.html',
  styleUrls: ['./manage-group.component.scss']
})
export class ManageGroupComponent implements OnInit {
  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.childrens && node.childrens.length > 0,
      name: node.name,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.childrens);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  treeRoundGroups: RoundGroup[] = [];
  listRoundGroups: RoundGroup[] = [];
  newGroup: string = "";
  jurisdictionFather: number = 0;

  constructor(private configService: ConfigService, private appComponent: AppComponent) {
    //this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnInit() {
    this.getRoundGroups();
  }

  getRoundGroups() {
    this.configService.getAllRoundGroups()
    .subscribe(data => {
      this.treeRoundGroups = data;
      this.dataSource.data = this.treeRoundGroups;
      this.getListRoundGroups();
    }, error => {
      this.appComponent.msgStandard("Operação Falhou", "Falha na operação de carregaamento. Tente novamente mais tarde.", 4);
      console.log(error);
    });
  }

  getListRoundGroups(){
    this.configService.getListedRoundGroups()
    .subscribe(data => {
      this.listRoundGroups = data;
    }, error => {
      this.appComponent.msgStandard("Operação Falhou", "Falha na operação de carregamento. Tente novamente mais tarde.", 4);
      console.log(error);
    });
  }

  createGroup(){
    this.configService.addRoundGroup(this.newGroup, this.jurisdictionFather)
    .subscribe(data => {
      this.appComponent.msgStandard("Realizado com Sucesso", "Novo grupo criado com sucesso.", 3);
      this.ngOnInit();
    }, error => {
      this.appComponent.msgStandard("Operação Falhou", "Falha na operação de inclusão. Tente novamente mais tarde.", 4);
    })
  }

  deleteGroup(){
    alert("Em Construção...");
  }

  editGroup(){
    alert("Em Construção...");
  }

}
