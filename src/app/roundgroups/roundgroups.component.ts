import { Component, OnInit } from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';

import { AppComponent } from '../app.component';
import { ConfigService } from '../config.service';

import { Round } from '../round.interface';
import { RoundGroup } from '../round-group.interface';

export class DataNode {
  name: string;
  childrens?: DataNode[];
}

@Component({
  selector: 'app-roundgroups',
  templateUrl: './roundgroups.component.html',
  styleUrls: ['./roundgroups.component.scss']
})
export class RoundgroupsComponent implements OnInit {
  treeControl = new NestedTreeControl<DataNode>(node => node.childrens);
  dataSource = new MatTreeNestedDataSource<DataNode>();
  roundGroups: RoundGroup[];
  rounds: Round[];

  constructor(private configService: ConfigService) {
  }

  ngOnInit() {
    this.listRoundGroups();
    this.listRounds();
    this.prepareDataSource();
  }

  private isGroup = (_: number, node: DataNode) => !!node.childrens;

  // TODO fake, to move to configService
  private listRoundGroups() {
    this.roundGroups = [
      {
        name: 'group1',
        rounds: [1],
        childrens: [],
        id: 1
      },
      {
        name: 'group2',
        rounds: [],
        childrens: [
          {
            name: 'group21',
            rounds: [2, 3],
            childrens: [],
            id: 21
          },
        ],
        id: 2
      },
      {
        name: 'group3',
        rounds: [],
        childrens: [
          {
            name: 'group31',
            rounds: [4],
            childrens: [
              {
                name: 'group311',
                rounds: [5],
                childrens: [],
                id: 311
              },
            ],
            id: 31
          },
        ],
        id: 3
      },
    ];
  }

  // TODO temporalrily disabled
  // listRounds(){
  //   this.configService.getAllRounds().subscribe(data => {
  //     this.rounds = data;
  //   }, error => {
  //     console.log(error);
  //   });
  // }

  // TODO fake, to move to configService
  private listRounds(){
    this.rounds = [
      {
        number: 1,
        startDateTime: new Date(),
        endDateTime: new Date(),
        matches: null,
        id: 1
      },
      {
        number: 2,
        startDateTime: new Date(),
        endDateTime: new Date(),
        matches: null,
        id: 2
      },
      {
        number: 3,
        startDateTime: new Date(),
        endDateTime: new Date(),
        matches: null,
        id: 3
      },
      {
        number: 4,
        startDateTime: new Date(),
        endDateTime: new Date(),
        matches: null,
        id: 4
      },
      {
        number: 5,
        startDateTime: new Date(),
        endDateTime: new Date(),
        matches: null,
        id: 5
      },
    ];
  }

  private prepareDataSource() {
    this.dataSource.data = this.buildDataNodes(this.roundGroups);
  }

  private buildDataNodes(roundGroups: RoundGroup[]): DataNode[] {
    var dataNodes : DataNode[] = [];

    for(var i in roundGroups) {
      var rg = roundGroups[i];
      var dn = new DataNode();
      dn.name = rg.name;
      dn.childrens = [];

      // evaluate rounds of this group
      for(var ir in rg.rounds) {
        var rId = rg.rounds[ir];
        var r = this.findRound(rId);
        if (!!r) {
          var dnr = new DataNode();
          dnr.name = r.number.toString();
          dnr.childrens = null;
          dn.childrens.push(dnr);
        }
      }

      // evaluate childgroups of this group
      var subdns = this.buildDataNodes(rg.childrens);
      for(var subdnI in subdns) {
        dn.childrens.push(subdns[subdnI]);
      }

      dataNodes.push(dn);
    }

    return dataNodes;
  }

  private findRound(id : number) : Round {
    for(var i in this.rounds) {
      if (this.rounds[i].id == id) {
        return this.rounds[i];
      }
    }
    return null;
  }
}
