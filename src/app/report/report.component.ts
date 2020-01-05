import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator, MatTableDataSource } from '@angular/material';

import { AppComponent } from '../app.component';
import { ConfigService } from '../config.service';

import { Round } from '../round.interface';
import { Report } from '../report.interface';
import { ReportFilter } from '../reportFilter.interface';
import { Jurisdiction } from '../jurisdiction.interface';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  displayedColumns: string[] = ['operator', 'amountSold', 'prizeValue', 'playerWinnings', 'percentage', 'amountToGive', 'amountToReceive', 'wasPaid'];
  dataSource = new MatTableDataSource<Report>();
  jurisdictions: Jurisdiction[];
  rounds: Round[];

  reportForm = this.fb.group({
    jurisdictionId: [0],
    dateStart: [''],
    dateEnd: [''],
    roundId: [0]
  });

  constructor(private configService: ConfigService, private appComponent: AppComponent, private fb: FormBuilder) {
    this.dataSource = new MatTableDataSource<Report>();
  }

  ngOnInit() {
    this.listJurisdiction();
    this.listRounds();
  }

  listJurisdiction(){
    this.configService.getJurisdictionsById(this.appComponent.userAdmin.jurisdictionId)
    .subscribe(data => {
      this.jurisdictions = data;
    }, error => {
      console.log(error);
    });
  }

  listRounds(){
    this.configService.getAllRounds().subscribe(data => {
      this.rounds = data;
    }, error => {
      console.log(error);
    });
  }

  getReport() {
    let reportFilter = {} as ReportFilter;
    reportFilter.userId = this.appComponent.userAdmin.id;
    reportFilter.roundId = this.reportForm.get('roundId').value;
    reportFilter.jurisdictionId = this.reportForm.get('jurisdictionId').value;

    if(this.reportForm.get('dateStart').value != "")
      reportFilter.dateStart = this.reportForm.get('dateStart').value;
    if(this.reportForm.get('dateEnd').value != "")
      reportFilter.dateEnd = this.reportForm.get('dateEnd').value;

    this.configService.getReport(reportFilter).subscribe(data => {
      console.log(data);
      this.dataSource = new MatTableDataSource<Report>(data);
      this.dataSource.paginator = this.paginator;
    }, error => {
      console.log(error);
    });
  }

}
