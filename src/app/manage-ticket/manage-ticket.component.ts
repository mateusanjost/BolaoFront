import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { Round } from '../round.interface';
import { Bet } from '../bet.interface';
import { User } from '../user.interface';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-manage-ticket',
  templateUrl: './manage-ticket.component.html',
  styleUrls: ['./manage-ticket.component.scss']
})
export class ManageTicketComponent implements OnInit {
  @ViewChild('frame2', { static: true }) modalTicket: ModalDirective;
  @ViewChild('frame3', { static: true }) modalCancel: ModalDirective;

  /*tickets = new Array<Ticket>();
  viewTicket: string = "";
  indexActivated: number;
  currentRound: Array<any>;

  constructor() { }

  ngOnInit() {
    this.createTickets();
    this.getRound();
  }*/
  round: Round;
  bets: Bet[] = [];
  users: User[] = [];
  userNameToShow = new Array<string>();
  isLoaded: boolean = false;
  searchReturn: boolean = false;
  resultSearch: string;
  
  indexActivated: number;
  viewTicket: string;

  constructor(private configService: ConfigService) { }

  ngOnInit() {
    this.getLastRound();

    setTimeout(() => {
      document.getElementById("spinner-loading").classList.add("hidden");
      this.isLoaded = true;
      this.listUserNames();
    }, 2000);

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
      this.getUsers();
    }, error => {
      console.log(error);
    })
  }

  getUsers(){
    this.configService.listUsers()
    .subscribe(data => {
      this.users = data;
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

  /*
   // later it will receive data from DB
   getRound() {
    let game1 = { teamHome: "BOT", logoHome: "botafogo.png", teamVisit: "SAO", logoVisit: "sao_paulo.png", date: "21/09", hour: "16:00"};
    let game2 = { teamHome: "CRU", logoHome: "cruzeiro.png", teamVisit: "FLA", logoVisit: "flamengo.png", date: "21/09", hour: "16:00"};
    let game3 = { teamHome: "COR", logoHome: "corinthians.png", teamVisit: "BAH", logoVisit: "bahia.png", date: "21/09", hour: "16:00"};
    let game4 = { teamHome: "SAN", logoHome: "santos.png", teamVisit: "GRE", logoVisit: "gremio.png", date: "21/09", hour: "16:00"};
    let game5 = { teamHome: "INT", logoHome: "internacional.png", teamVisit: "CHA", logoVisit: "chapecoense.png", date: "22/09", hour: "16:00"};
    let game6 = { teamHome: "FOR", logoHome: "fortaleza.png", teamVisit: "PAL", logoVisit: "palmeiras.png", date: "22/09", hour: "16:00"};
    let game7 = { teamHome: "VAS", logoHome: "vasco.png", teamVisit: "CAP", logoVisit: "atletico_paranaense.png", date: "22/09", hour: "16:00"};
    let game8 = { teamHome: "CSA", logoHome: "csa.png", teamVisit: "CEA", logoVisit: "ceara.png", date: "22/09", hour: "16:00"};
    let game9 = { teamHome: "GOI", logoHome: "goias.png", teamVisit: "FLU", logoVisit: "fluminense.png", date: "22/09", hour: "16:00"};
    let game10 = { teamHome: "AVA", logoHome: "avai.png", teamVisit: "CAM", logoVisit: "atletico_mineiro.png", date: "22/09", hour: "16:00"};

    this.currentRound = [ game1, game2, game3, game4, game5, game6, game7, game8, game9, game10 ];
  }

  createTickets(){
    this.tickets[0] = new Ticket();
    this.tickets[0].idTicket = 1124;
    this.tickets[0].date = "19/09/2019";
    this.tickets[0].hour = "19:00";
    this.tickets[0].operator = "AGENCIA01";
    this.tickets[0].playerName = "José";
    this.tickets[0].results = ["1", "X", "2", "2", "1", "X", "1", "2", "1", "1" ];
    this.tickets[0].value = 10;
    this.tickets[0].status = true;
    this.tickets[0].idRound = 20;

    this.tickets[1] = new Ticket();
    this.tickets[1].idTicket = 1125;
    this.tickets[1].date = "19/09/2019";
    this.tickets[1].hour = "19:15";
    this.tickets[1].operator = "MN";
    this.tickets[1].playerName = "Nando";
    this.tickets[1].results = ["1", "X", "1", "1", "2", "X", "1", "X", "1", "X" ];
    this.tickets[1].value = 10;
    this.tickets[1].status = false;
    this.tickets[1].idRound = 20;

    this.tickets[2] = new Ticket();
    this.tickets[2].idTicket = 1126;
    this.tickets[2].date = "20/09/2019";
    this.tickets[2].hour = "08:30";
    this.tickets[2].operator = "Rio";
    this.tickets[2].playerName = "anônimo";
    this.tickets[2].results = ["1", "1", "X", "X", "1", "X", "2", "X", "2", "2" ];
    this.tickets[2].value = 10;
    this.tickets[2].status = true;
    this.tickets[2].idRound = 20;
  }*/

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

  /*
  makeTicket(index: number, whichModal: number){
    this.indexActivated = index;

    let results: string = ""
    for(let i = 0; i < 10; i++){
      results += this.currentRound[i].teamHome + ' X ' + this.currentRound[i].teamVisit + ' [' + this.tickets[index].results[i] + "] <br/>";
    }
    this.viewTicket = 
    'id bilhete: '+ this.tickets[index].idTicket + ' - rodada: ' + this.tickets[index].idRound + '<br/>' +
    ' data: ' + this.tickets[index].date + ' - hora: ' + this.tickets[index].hour + '<br/>'+
    'operador: ' + this.tickets[index].operator + ' - jogador: ' + this.tickets[index].playerName + '<br/><br/>'+
    'resultados:<br/><br/>' + results;

    if (whichModal == 1){
      this.modalTicket.show();
    }
    else {
      this.modalCancel.show();
    }
  }

  cancelTicket(){
    this.tickets[this.indexActivated].status = false;
    alert("Ticket cancelado com sucesso!");

    this.modalCancel.hide();
  }*/

  // searchTicket(){
  //   document.getElementById('result-text').classList.remove("content-hidden");
  // }

}
/*
class Ticket {
  idTicket: number;
  date: string;
  hour: string;
  operator: string;
  playerName: string;
  results: Array<string>;
  value: number;
  status: boolean;
  idRound: number;
}*/