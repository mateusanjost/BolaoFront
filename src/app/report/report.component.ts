import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AppComponent } from '../app.component';
import { ConfigService } from '../config.service';

import { Relatorio } from '../report.interface';
import { ReportFilter } from '../reportFilter.interface';
import { Jurisdiction } from '../jurisdiction.interface';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  displayedColumns: string[] = ['operator', 'amountSold', 'prizeValue', 'playerWinnings', 'percentage', 'amountToGive', 'amountToReceive', 'wasPaid'];
  dataSource : Relatorio[];
  jurisdictions: Jurisdiction[];

  reportForm = this.fb.group({
    jurisdictionId: [0],
    dateStart: [''],
    dateEnd: [''],
    roundId: [0]
  });

  constructor(private configService: ConfigService, private appComponent: AppComponent, private fb: FormBuilder) { 
    this.dataSource = [];
  }

  ngOnInit() {
    this.listJurisdiction();   
  }

  listJurisdiction(){
    this.configService.getJurisdictionsById(this.appComponent.userAdmin.jurisdictionId)
    .subscribe(data => {
      this.jurisdictions = data;           
    }, error => {
      console.log(error);
    });
  }

  getReport() {

    // let reportFilter: ReportFilter = {
    //   userId: 0,
    //   dateStart: new Date(),
    //   dateEnd: new Date(),
    //   jurisdictionId: 0,
    //   playerId: 0,
    //   roundId: 0
    // }

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
      this.dataSource = data;
    }, error => {
      console.log(error);      
    });
  }

}
