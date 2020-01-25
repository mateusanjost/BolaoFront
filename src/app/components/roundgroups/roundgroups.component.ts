import { Component, OnInit }       from '@angular/core';
import { NestedTreeControl }       from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

import { AppComponent }       from '../../app.component';
import { ConfigService }      from '../../config.service';
import { InteractionService } from '../../interaction.service';
import { Round }              from '../../round.interface';
import { RoundGroup }         from '../../round-group.interface';

export class DataNode {
    name: string;
    roundId: number;
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

    constructor(
        private interactionService: InteractionService,
        private configService: ConfigService) {
    }

    ngOnInit() {
        this.listRoundGroups();
        this.listRounds();
    }

    public isGroup = (_: number, node: DataNode) => !!node.childrens;

    public loadRound(roundId: number){
        this.configService.getRound(roundId)
            .subscribe(data => {
                this.interactionService.setHomeVisibleRound(data);
            }, error => {
                console.log(error);
            });
    }

    private listRoundGroups() {
        this.configService.getAllRoundGroups().subscribe(data => {
            this.roundGroups = data;
            this.prepareDataSource();
        }, error => {
            console.log(error);
        });
    }

    private listRounds(){
        this.configService.getAllRounds().subscribe(data => {
            this.rounds = data;
            this.prepareDataSource();
        }, error => {
            console.log(error);
        });
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
                    dnr.name = "Rodada nº " + r.number.toString();
                    dnr.roundId = r.id;
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
