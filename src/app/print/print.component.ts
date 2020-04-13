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
import { TranslateService } from '@ngx-translate/core';

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

  constructor(private configService: ConfigService, private router: Router,
    private appComponent: AppComponent, private translate: TranslateService) {
      this.translate.setDefaultLang(this.appComponent.activeLang);
    }

  ngOnInit() {
    this.getUser();
  }

  getUser(){
    this.user = this.appComponent.userAdmin;
    this.getLastUserBet();
  }

  getLastUserBet(){
    this.configService.getLastUserBet(this.user.id)
    .subscribe(data => {
      this.bet = data;
      this.getGames();
    }, error => {
      this.appComponent.msgStandard(this.translate.instant("pg-print.print-fail"), this.translate.instant("pg-print.print-fail-info"), 4);
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
      this.appComponent.msgStandard(this.translate.instant("pg-print.print-fail"), this.translate.instant("pg-print.print-fail-info"), 4);
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
      this.appComponent.msgStandard(this.translate.instant("pg-print.print-fail"), this.translate.instant("pg-print.print-fail-info"), 4);
      console.log(error);
      window.close();
    });
  }

  openModal(){
    this.generateTicket();

    this.modalPrint.show();
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
    this.htmlToAdd += "id: " + this.bet.id + " - " +
      this.translate.instant("pg-print.creation") + ': ' + showDateHour.getDate() + '/' + (showDateHour.getMonth() + 1) + ' - ' + showDateHour.getHours() + ':' + showDateHour.getMinutes() + '<br/>' +
      this.translate.instant("pg-print.round") + ": " + this.round.number + "<br/>" +
      this.translate.instant("pg-print.operator") + ": " + this.user.login + " - " + this.translate.instant("pg-print.player") +": " + this.bet.playerName + "<br/>" +
      "resultados: <br/>" + msgResult + 
      "<br/><br/>" + this.translate.instant("pg-print.final-warnning");
  }

  print(){
    window.print();
  }

  closePrintModal(){
    window.close();
  }
}


