import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { Router } from '@angular/router';
//import { HomeComponent } from '../home/home.component';
import { AppComponent } from '../app.component';
import { Bet } from '../bet.interface';
import { User } from '../user.interface';
import { ConfigService } from '../config.service';
import { Game } from '../game.interface';
import { Round } from '../round.interface';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit {
  @ViewChild('frame4', { static: true }) modalPrint: ModalDirective;

  isPrinting = true;
  isLoadded = false;
  htmlToAdd: string = "";
  bet: Bet;
  user: User;
  round: Round;
  games: Game[] = [];

  constructor(private configService: ConfigService, private router: Router, private appComponent: AppComponent) { }

  ngOnInit() {
    this.getUser();
    /*setTimeout(() => {
      document.getElementById("spinner-loading").classList.add("hidden");
      this.openModal();
    }, 2000);*/
  }

  getUser(){
    this.user = this.appComponent.userAdmin;
    this.getLastUserBet();
  }

  getLastUserBet(){
    this.configService.getLastUserBet(this.user.id)
    .subscribe(data => {
      this.bet = data;
      //document.getElementById("spinner-loading").classList.add("hidden");
      //this.openModal();
      this.getGames();
    }, error => {
      alert("Houve algum erro ao tentar imprimir.");
      console.log(error);
      window.close();
    });
  }

  getGames(){
    this.configService.getGames(this.bet.roundId)
    .subscribe(data => {
      this.games = data;
      this.getRound();
    }, error => {
      alert("Houve algum erro ao tentar imprimir.");
      console.log(error);
      window.close();
    });
  }
  
  getRound(){
    this.configService.getLastRound()
    .subscribe(data => {
      this.round = data;
      this.openModal();
    }, error => {
      alert("Houve algum erro ao tentar imprimir.");
      console.log(error);
      window.close();
    });
  }

  openModal(){
    this.generateTicket();

    this.modalPrint.show();

    //this.htmlToAdd = "Id: " + this.bet.id;
    this.print();
  }

  generateTicket(){
    let showDateHour = new Date(this.bet.betDate);
    let msgResult = "<table width='100%' border='1'>";
    let result = (this.bet.results.replace(/\|/g,''));
    for(let i = 0; i < this.games.length; i++){
      this.bet.results.replace("|", "");
      //msgResult += this.games[i].homeName + " - " + this.games[i].awayName + ": <b>" + this.bet.results.substring((i + 1), (i + 2)) +"</b><br/>";
      msgResult += "<tr><td>" + this.games[i].homeName + " - " + this.games[i].awayName + "</td><td style='text-align: right'><b>" + result.charAt(i) +"</b></td></tr>";
    }
    msgResult += "</table>";
    console.log(msgResult);
    this.htmlToAdd += "id: " + this.bet.id + " - " +
    ' criação: ' + showDateHour.getDate() + '/' + (showDateHour.getMonth() + 1) + ' - ' + showDateHour.getHours() + ':' + showDateHour.getMinutes() + '<br/>' +
      "rodada: " + this.round.number + "<br/>" +
      "operador: " + this.user.login + " - jogador: " + this.bet.playerName + "<br/>" +
      //"resultados: " + this.bet.results + 
      "resultados: <br/>" + msgResult + 
      "<br/><br/>" + 
      "Boa sorte! Confira o seu bilhete. Pagamentos serão efetuados em até 48 horas úteis após o término do último evento. Máximo de R$ 20.000 "+
      "Resutado regulamentar 90 minutos + acréscimos. Apostas feitas após o início do jogo serão canceladas. Pedidos para cancelar bilhete até duas "+
      "horas depois da emissão com apresentação da primeira via.";
  }

  print(){
    window.print();
  }

  closePrintModal(){
    //this.modalPrint.hide();
    //this.router.navigate(['/home']);
    //location.reload();
    window.close();
  }
}


