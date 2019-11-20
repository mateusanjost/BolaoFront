import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { Round } from '../round.interface';
import { Bet } from '../bet.interface';
import { User } from '../user.interface';
import { ConfigService } from '../config.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-manage-ticket',
  templateUrl: './manage-ticket.component.html',
  styleUrls: ['./manage-ticket.component.scss']
})
export class ManageTicketComponent implements OnInit {
  @ViewChild('frame2', { static: true }) modalTicket: ModalDirective;
  @ViewChild('frame3', { static: true }) modalCancel: ModalDirective;

  round: Round;
  bets: Bet[] = [];
  users: User[] = [];
  userNameToShow = new Array<string>();
  isLoaded: boolean = false;
  searchReturn: boolean = false;
  resultSearch: string;
  
  indexActivated: number;
  viewTicket: string;

  constructor(private configService: ConfigService, private appComponent: AppComponent) { }

  ngOnInit() {
    this.getLastRound();
  }

  getLastRound(){
    this.configService.getLastRound()
    .subscribe(data => {
      this.round = data;
      //this.getBets();
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
        document.getElementById("spinner-loading").classList.add("hidden");
        this.isLoaded = true;
        this.listUserNames();
      }, error => {
        console.log(error);
      });
  }

  /*
  getBets(){
    this.configService.getAllBets(this.round.id)
    .subscribe(data => {
      this.bets = data;
      this.getUsers();
    }, error => {
      console.log(error);
    })
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
  }*/

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
      alert ("Pule de código " + ticketCode + " não encontrada na rodada atual!");
    }
    else {
      document.getElementById('result-text').classList.remove("content-hidden");
      this.resultSearch = "código: " + this.bets[indexTicket].id +
      " | jogador: " + this.bets[indexTicket].playerName + " | situação: " + (this.bets[indexTicket].status == 1 ? "Ativo" : "Cancelado");
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
    'id bilhete: '+ this.bets[index].id + ' - rodada: ' + this.bets[index].roundId + '<br/>' +
    ' data: ' + completeDate + ' - hora: ' + hour + '<br/>'+
    'operador: ' + this.userNameToShow[index] + ' - jogador: ' + this.bets[index].playerName + '<br/><br/>'+
    'resultados:<br/><br/>' + results;
    
    if (whichModal == 1){
      this.modalTicket.show();
    }
    else {
      this.modalCancel.show();
    }
  }

  cancelTicket(){
    this.bets[this.indexActivated].status = 0;
    this.configService.updateBet(this.bets[this.indexActivated])
      .subscribe(data => {
        alert("Ticket cancelado com sucesso!");
      }, error => {
        alert("Não foi possível cancelar este bilhete!");
      })
    /*
    this.bets[this.indexActivated].status = 0;
    */

    this.modalCancel.hide();
  }

}