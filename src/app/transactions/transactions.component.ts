import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { MatTableDataSource, MatPaginator } from '@angular/material';

import { Transaction } from '../transaction.interface';
import { ConfigService } from '../config.service';
import { AppComponent } from '../app.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  displayedColumns: string[] = ['id', 'date', 'type', 'description', 'creditIn', 'creditOut', 'credit'];
  dataSource = new MatTableDataSource<Transaction>();
  
  constructor(private configService: ConfigService, private appComponent: AppComponent,
    private fb: FormBuilder, private translate: TranslateService) {
    this.dataSource = new MatTableDataSource<Transaction>();
    this.translate.setDefaultLang(this.appComponent.activeLang);
   }

  ngOnInit() {
    this.listTransactions(this.appComponent.userAdmin.id);
  }

  listTransactions(userId: number){
    this.configService.getTransactionsByUserId(userId).subscribe(data => {
      console.log(data);
      this.dataSource = new MatTableDataSource<Transaction>(data);
      this.dataSource.paginator = this.paginator;
    }, error => {
      console.log(error);
    });
  }

}
