import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';
import { Round } from '../round.interface';
import { Bet } from '../bet.interface';
import { User } from '../user.interface';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {

  round: Round;
  bets: Bet[];
  users: User[];
  userNameToShow = new Array<string>();
  isLoaded: boolean = false;
  searchReturn: boolean = false;
  resultSearch: string;

  constructor(private configService: ConfigService, private appComponent: AppComponent) { }

  ngOnInit() {
    this.getLastRound();

    // setTimeout(() => {
    //   document.getElementById("spinner-loading").classList.add("hidden");
    //   this.isLoaded = true;
    //   this.listUserNames();
    // }, 2000);

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
      this.appComponent.msgStandard("Bilhete Não Encontrado", "Pule de código " + ticketCode + " não ativada na rodada atual!", 4);
    }
    else {
      document.getElementById('result-text').classList.remove("content-hidden");
      this.resultSearch = "código: " + this.bets[indexTicket].id + " | operador: " + this.userNameToShow[indexTicket] +
      " | jogador: " + this.bets[indexTicket].playerName + " | resultados: " + this.bets[indexTicket].results;
    }
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

}
