import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../config.service';
import { Round } from '../round.interface';
import { Bet } from '../bet.interface';
import { User } from '../user.interface';
import { AppComponent } from '../app.component';
import { TranslateService } from '@ngx-translate/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table'

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {
  displayedColumns: string[] = ['id', 'operator', 'login', 'results'];
  dataSource = new MatTableDataSource<Bet>();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  round: Round;
  allRounds: Round[] = [];
  bets: Bet[];
  users: User[];
  userNameToShow = new Array<string>();
  isLoaded: boolean = false;
  searchReturn: boolean = false;
  resultSearch: string;

  constructor(private configService: ConfigService, private appComponent: AppComponent,
    private translate: TranslateService) {
    this.translate.setDefaultLang(this.appComponent.activeLang);
   }

  ngOnInit() {
    this.getRounds();
  }

  searchTicket(){
    document.getElementById('result-text').classList.add("content-hidden");
    this.searchReturn = false;
    this.resultSearch = "";
    let ticketCode: number = +(<HTMLInputElement>document.getElementById("ticket-id")).value;
    let indexTicket: number;

    let betFound: any;

    for (let i = 0; i < this.bets.length; i++){
      if (ticketCode == this.bets[i].id){
        indexTicket = i;
        this.searchReturn = true;

        betFound = this.bets[i];
      }
    }

    if (!this.searchReturn){
      //alert ("Pule de código " + ticketCode + " não encontrada na rodada atual!");
      this.appComponent.msgStandard(this.translate.instant("pg-tickets.ticket-not-found"), this.translate.instant("pg-tickets.code-of-ticket") + ticketCode + this.translate.instant("pg-tickets.not-activated"), 4);
    }
    else {
      let stringTable = "<table class='white-text table table-striped' border='1' width='100%'><tr><td>ID</td><td>"+ this.translate.instant("pg-tickets.operator") + "</td><td>"+ this.translate.instant("pg-tickets.player") +"</td><td>" + this.translate.instant("pg-tickets.results") + "</td></tr>"+
      "<tr><td>"+ ticketCode + "</td><td>" + this.userNameToShow[indexTicket] + "</td><td>" + this.bets[indexTicket].playerName + "</td>"+
      "<td>" + this.bets[indexTicket].results + "</td></tr>" +
      "</table>";
      this.appComponent.msgStandard(this.translate.instant("pg-tickets.resume-ticket") + ticketCode, stringTable, 1);
    }
  }

  getRounds(){
    this.configService.getRounds()
    .subscribe(data => {
      this.allRounds = data.sort((a, b) => (a.id < b.id) ? 1 : -1);
      this.getLastRound();
    }, error => {
      console.log(error);
    });
  }

  getLastRound(){
    this.configService.getLastRound()
    .subscribe(data => {
      this.round = data;
      this.getBets();
    }, error => {
      console.log(error);
    });
  }

  getBets(){
    this.configService.getBets(this.round.id)
    .subscribe(data => {
      this.bets = data;
      this.dataSource.data = data;
      this.setPagination();
      //this.getUsers();
    }, error => {
      console.log(error);
    })
  }

  setPagination(){
    this.dataSource.paginator = this.paginator;
    this.getUsers();
  }

  getUsers(){
    this.configService.listUsers()
    .subscribe(data => {
      this.users = data;
      document.getElementById("spinner-loading").classList.add("hidden");
      this.isLoaded = true;
      this.listUserNames();
    }, error => {
      console.log(error);
    })
  }

  listUserNames(){
    let count = 0;
    let limit = this.bets.length;

    while(count < limit){
      for (let i = 0; i < this.users.length; i++){
        if (this.users[i].id == this.bets[count].userAdminId){
          this.userNameToShow[count] = this.users[i].login;
        }
      }

      count++;
    }

  }

  changeRoundBets(roundId: number){
    this.configService.getRound(roundId)
    .subscribe(data => {
      this.round = data;
      this.getBets();
    });
  }

}
