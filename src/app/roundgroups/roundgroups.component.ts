import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

import { AppComponent } from '../app.component';
import { ConfigService } from '../config.service';

import { Round } from '../round.interface';

@Component({
  selector: 'app-roundgroups',
  templateUrl: './roundgroups.component.html',
  styleUrls: ['./roundgroups.component.scss']
})
export class RoundgroupsComponent implements OnInit {

  displayedColumns: string[] = ['number'];
  dataSource: MatTableDataSource<Round>;

  constructor(private configService: ConfigService, private appComponent: AppComponent) {
    this.dataSource = new MatTableDataSource<Round>();
  }

  ngOnInit() {
    this.listRounds();
  }

  listRounds(){
    this.configService.getAllRounds().subscribe(data => {
      this.dataSource = new MatTableDataSource<Round>(data);
      this.dataSource.paginator = this.paginator;
    }, error => {
      console.log(error);
    });
  }
}
