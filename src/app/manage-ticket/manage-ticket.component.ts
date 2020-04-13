import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { Round } from '../round.interface';
import { Bet } from '../bet.interface';
import { User } from '../user.interface';
import { ConfigService } from '../config.service';
import { AppComponent } from '../app.component';
import { TranslateService } from '@ngx-translate/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-manage-ticket',
  templateUrl: './manage-ticket.component.html',
  styleUrls: ['./manage-ticket.component.scss']
})
export class ManageTicketComponent implements OnInit {
  @ViewChild('frame2', { static: true }) modalTicket: ModalDirective;
  @ViewChild('frame3', { static: true }) modalCancel: ModalDirective;

  displayedColumns: string[] = ['id', 'status', 'player', 'actions'];
  dataSource = new MatTableDataSource<Bet>();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  round: Round;
  allRounds: Round[] = [];
  bets: Bet[] = [];
  users: User[] = [];
  userNameToShow = new Array<string>();
  isLoaded: boolean = false;
  searchReturn: boolean = false;
  resultSearch: string;
  
  indexActivated: number;
  viewTicket: string;

  constructor(private configService: ConfigService, private appComponent: AppComponent,
    private translate: TranslateService) {
      this.translate.setDefaultLang(this.appComponent.activeLang);
      this.dataSource.paginator = this.paginator;
     }

  ngOnInit() {
    this.getLastRound();
  }

  getLastRound(){
    this.configService.getLastRound()
    .subscribe(data => {
      this.round = data;
      this.getRounds();
    }, error => {
      console.log(error);
    });
  }

  getRounds(){
    this.configService.getRounds()
    .subscribe(data => {
      this.allRounds = data.sort((a, b) => (a.id < b.id) ? 1 : -1);
      this.getUsers();
    }, error => {
      console.log(error);
    });
  }

  getUsers(){
    this.configService.getUsersTreeList(this.appComponent.userAdmin.id)
    .subscribe(data => {
      this.users = data;
      this.getBets();
    }, error => {
      console.log(error);
    });
  }

  getBets(){
    this.configService.getBetsByUserTree(this.appComponent.userAdmin.id, this.round.id)
      .subscribe(data => {
        this.bets = data;
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        document.getElementById("spinner-loading").classList.add("hidden");
        this.isLoaded = true;
        this.listUserNames();
      }, error => {
        console.log(error);
      });
  }

  listUserNames(){
    let count = 0;
    let limit = this.bets.length;

    while(count < limit){
      for (let i = 0; i < this.users.length; i++){
        if (this.users[i].id == this.bets[count].userAdminId){
          this.userNameToShow[count] = this.users[i].name;
        }
      }
      count++;
    }

  }

  searchTicket(){
    document.getElementById('result-text').classList.add("content-hidden");
    this.searchReturn = false;
    this.resultSearch = "";
    let ticketCode: number = +(<HTMLInputElement>document.getElementById("ticket-id")).value;
    let indexTicket: number;

    for (let i = 0; i < this.bets.length; i++){
      if (ticketCode == this.bets[i].id){
        indexTicket = i;
        this.searchReturn = true;
      }
    }

    if (!this.searchReturn){
      //alert ("Pule de código " + ticketCode + " não encontrada na rodada atual!");
      this.appComponent.msgStandard(this.translate.instant("pg-manage-ticket.ticket-not-found"), this.translate.instant("pg-manage-ticket.ticket-of-code") + ticketCode + this.translate.instant("pg-manage-ticket.not-found-current-round"), 4);
    }
    else {
      document.getElementById('result-text').classList.remove("content-hidden");
      this.resultSearch = this.translate.instant("pg-manage-ticket.code") + ": " + this.bets[indexTicket].id +
      " | " + this.translate.instant("pg-manage-ticket.player") + ": " + this.bets[indexTicket].playerName + " | "+ this.translate.instant("pg-manage-ticket.status") + ": " + (this.bets[indexTicket].status == 1 ? this.translate.instant("pg-manage-ticket.activated") : this.translate.instant("pg-manage-ticket.canceled"));
    }
  }

  makeTicket(index: number, whichModal: number){
    this.indexActivated = index;
    
    let results: string = this.bets[index].results;

    let day = this.bets[index].betDate.toString().substring(8, 10);
    let month = this.bets[index].betDate.toString().substring(5, 7);
    let year = this.bets[index].betDate.toString().substring(0, 4);
    let hour = this.bets[index].betDate.toString().substring(11, 16);
    let completeDate: string = day + '/' + month + '/' + year;

    this.viewTicket = 
    this.translate.instant("pg-manage-ticket.code") + ': '+ this.bets[index].id + ' - ' + this.translate.instant("pg-manage-ticket.round") + ': ' + this.bets[index].roundId + '<br/>' +
    ' ' + this.translate.instant("pg-manage-ticket.date") + ': ' + completeDate + ' - ' + this.translate.instant("pg-manage-ticket.hour")+ ': ' + hour + '<br/>'+
    this.translate.instant("pg-manage-ticket.operator") + ': ' + this.userNameToShow[index] + ' - ' + this.translate.instant("pg-manage-ticket.player") + ': ' + this.bets[index].playerName + '<br/><br/>'+
    this.translate.instant("pg-manage-ticket.results") + ':<br/><br/>' + results;
    
    if (whichModal == 1){
      this.modalTicket.show();
    }
    else {
      this.modalCancel.show();
    }
  }

  cancelTicket(){
    // ATTENTION: using this field for a while just to make it work for now
    this.bets[this.indexActivated].resultBetId = this.appComponent.userAdmin.id;

    this.configService.updateBet(this.bets[this.indexActivated])
      .subscribe(data => {
        this.appComponent.msgStandard(this.translate.instant("pg-manage-ticket.ticket-canceled"), this.translate.instant("pg-manage-ticket.ticket-canceled-info"), 3);
        this.bets[this.indexActivated].status = 0;
      }, error => {
        let msgComplement: string;
        if (error.error == "Time exceeded!"){
          msgComplement = this.translate.instant("pg-manage-ticket.time-exceeded");
        }

        if (error.error == "You're not the owner."){
          msgComplement = this.translate.instant("pg-manage-ticket.only-owner");
        }

        this.appComponent.msgStandard(this.translate.instant("pg-manage-ticket.not-canceled"), this.translate.instant("pg-manage-ticket.not-canceled-info") + " " + msgComplement, 4);
      });

    this.modalCancel.hide();
  }

  changeRoundBets(roundId: number){
    this.configService.getRound(roundId)
    .subscribe(data => {
      this.round = data;
      this.getBets();
    });
  }

}