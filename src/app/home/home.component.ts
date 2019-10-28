import { Component, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { ModalDirective } from 'angular-bootstrap-md';
import { ConfigService } from '../config.service';
//import { Team } from '../team.interface';
import { Round } from '../round.interface';
import { Game } from '../game.interface';
import { ResponseGame } from '../response-game.class';
import { Prize } from '../prize.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('frame2', { static: true }) modalCreate: ModalDirective;

  isLogged: boolean = false;
  htmlToAdd: any;
  currentRound = new Array<any>();
  //teams: Team[];
  round: Round;
  games: Game[];
  isLoaded: boolean = false;
  idRound: number;
  dateBegin: string;
  dateEnd: string;
  responseGames = new Array<ResponseGame>();
  prizes: Prize;
  jackpot: string;
  prizeAmount: string;
  fullPrize: string;

  ticket = {
    id: 0, date: new Date(Date.now()), hour: new Date(Date.now()), userName: "", playerName: "", status: "inactivated", roundId: 0,
    results: ["", "", "", "", "", "", "", "", "", ""],  resultToPass: "", userId: 1
  };

  message = "Obrigatório escolher resultado para todos os jogos.";

  constructor(private configService: ConfigService, private appComponent: AppComponent, private router: Router) {
    this.isLogged = appComponent.isLogged;
  }

  ngOnInit() {
    this.isLogged = this.appComponent.isLogged;
    //this.getRound();

    //this.listTeams();
    this.getLastRound();
    this.getPrize();

    // setTimeout(() => {
      
    // }, 4000);
  }

  getPrize(){
    this.configService.getPrize()
    .subscribe(data => {
      this.prizes = data;
      this.jackpot = (this.prizes[0].gathered).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      this.prizeAmount = (this.prizes[1].gathered).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      this.fullPrize = (this.prizes[0].gathered + this.prizes[1].gathered).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }, error =>{
      console.log(error);
    });
  }

  /*
  listTeams() {
    this.configService.listTeams()
    .subscribe(data => {
      this.teams = data;
      this.getLastRound();
    }, error =>{
      console.log(error);
    });
  }
  */

  getLastRound(){
    this.configService.getLastRound()
    .subscribe(data => {
      this.round = data;
      this.getGames();
    }, error => {
      console.log(error);
    });
  }

  getGames(){
    this.configService.getGames(this.round.id)
    .subscribe(data => {
      this.games = data;
      this.initRound();
      document.getElementById("spinner-loading").classList.add("hidden");
      this.isLoaded = true;
    }, error => {
      console.log(error);
    });
  }

  // will be used to get data from DB
  initRound(){

    this.idRound = this.round.number;
    this.dateBegin = this.round.startDateTime.toString();
    this.dateEnd = this.round.endDateTime.toString();

    this.generateGames();
  }

  generateGames(){

    this.responseGames = new Array<ResponseGame>();

    for(let i = 0; i < this.games.length; i++){
      this.responseGames[i] = new ResponseGame();
      this.responseGames[i].idGame = this.games[i].id;
      this.responseGames[i].teamHome = this.games[i].homeName;
      this.responseGames[i].teamVisit = this.games[i].awayName;
      //this.responseGames[i].homeAbbreviation = this.teams[this.games[i].homeTeamId - 1].abbreviation;
      //this.responseGames[i].visitAbbreviation = this.teams[this.games[i].awayTeamId - 1].abbreviation;
      //this.responseGames[i].imgLogoTeamHome = this.teams[this.games[i].homeTeamId - 1].fileDataId;
      //this.responseGames[i].imgLogoTeamVisit = this.teams[this.games[i].awayTeamId - 1].fileDataId;
      this.responseGames[i].homeTeamScore = this.games[i].homeTeamScore;
      this.responseGames[i].awayTeamScore = this.games[i].awayTeamScore;
      this.responseGames[i].dateBegin = this.games[i].dateTime;
      this.responseGames[i].hourBegin = this.games[i].dateTime;
      this.responseGames[i].dateEnd = this.games[i].dateTime;
      this.responseGames[i].hourEnd = this.games[i].dateTime;
    }
  }
 
  // --- TICKET CREATION --- //
  chooseGameResult(resultIndex: number, resultChoosen: string) {

    // register inside the object
    if (this.ticket.results[resultIndex] == resultChoosen) {
      this.ticket.results[resultIndex] = "";
    }
    else {
      // when is the same, uncheck that result
      this.ticket.results[resultIndex] = resultChoosen;
    }

    // update format of every games
    this.makeFormatting();

  }

  makeFormatting() {
    // when any result is selected, runs for all result options updanting their colors
    for (let i = 0; i < 10; i++) {
      switch (this.ticket.results[i]) {
        case '1':
          document.getElementById(i + 'a').classList.add("bg-yellow");
          document.getElementById(i + 'b').classList.remove("bg-yellow");
          document.getElementById(i + 'c').classList.remove("bg-yellow");
          break;
        case 'X':
          document.getElementById(i + 'a').classList.remove("bg-yellow");
          document.getElementById(i + 'b').classList.add("bg-yellow");
          document.getElementById(i + 'c').classList.remove("bg-yellow");
          break;
        case '2':
          document.getElementById(i + 'a').classList.remove("bg-yellow");
          document.getElementById(i + 'b').classList.remove("bg-yellow");
          document.getElementById(i + 'c').classList.add("bg-yellow");
          break;
        default:
          document.getElementById(i + 'a').classList.remove("bg-yellow");
          document.getElementById(i + 'b').classList.remove("bg-yellow");
          document.getElementById(i + 'c').classList.remove("bg-yellow");
          break;
      }
    }

  }
  onOpen(event: any) {
    // allways when opens the modal to confirm the bet, must be logged in
    this.isLogged = this.appComponent.isLogged;

    // once logged in, verify if is everything allright with the current ticket; if so, show the ticket
    if (this.isLogged) {
      if (this.checkTicket()) {
        let msgResult = "";
        for (let i = 0; i < 10; i++){
          let result = "";
          if (this.ticket.results[i] == '1'){
            result = this.responseGames[i].teamHome + ' [1]';
            this.ticket.resultToPass += '1';
            this.ticket.resultToPass += i < 9 ? '|' : '';
          }
          else if (this.ticket.results[i] == 'X'){
            result = "EMPATE [X]";
            this.ticket.resultToPass += 'X';
            this.ticket.resultToPass += i < 9 ? '|' : '';
          }
          else {
            result = this.responseGames[i].teamVisit + ' [2]';
            this.ticket.resultToPass += '2';
            this.ticket.resultToPass += i < 9 ? '|' : '';
          }
          msgResult += this.responseGames[i].teamHome + ' X ' + this.responseGames[i].teamVisit + ' : ' + result + '<br/>';
        let showDateHour = new Date(this.ticket.date);
        this.htmlToAdd = 
        /*'id bilhete: '+ this.ticket.id + ' - */'rodada: ' + this.ticket.roundId + '<p/>' +
        //' data: ' + this.ticket.date + ' - hora: ' + this.ticket.hour + '<br/>'+
        ' criação: ' + showDateHour.getDate()+'/'+ (showDateHour.getMonth()+1) + ' - ' + showDateHour.getHours()+':'+ showDateHour.getMinutes() + '<br/>'+
        'operador: ' + this.appComponent.userAdmin.name + ' - jogador: ' + this.ticket.playerName + '<br/><br/>'+
        msgResult;
        }
      }
      else {
        this.htmlToAdd = 'Obrigatório escolher <b>todos os resultados</b> e preencher o <b>nome do jogador</b>.';
      }
    }
  }

  checkTicket() {
    let test: boolean = true;

    // check whether all results was choosen
    for (let i = 0; i < 10; i++) {
      if (this.ticket.results[i] == "") {
        test = false;
      }
    }

    // check if is there the player name; if so, fullfill the ticket object to go ahead
    let playerName = (<HTMLInputElement>document.getElementById("player-name")).value;
    if (playerName == "") {
      test = false;
    }
    else {
      this.ticket.id = 10;
      this.ticket.roundId = this.round.id;
      this.ticket.playerName = playerName;
      this.ticket.date = new Date(Date.now());
      this.ticket.hour = new Date(Date.now());
      this.ticket.status = "activated";
      this.ticket.userId = this.appComponent.userAdmin.id;
    }

    return test;

  }

  postTicket(){
    this.configService.postBet(this.ticket)
    .subscribe(data => {
      this.updateJackpot();
      //this.clearTicket();
    }, error => {
      alert("Erro de conexão! Cód: 99");
      console.log(error);
    })

  }

  updateJackpot(){
    let newValeu = this.prizes[0].gathered + 2;
    let newPrizes: Prize;
    newPrizes = this.prizes[0];
    newPrizes.gathered = +newValeu;
    newPrizes.type = 2;

    this.configService.updateJackpot(newPrizes)
      .subscribe(data => {
        this.updateApportionment();
      }, error => {
        console.log(error);
        alert("Houve algum erro de conexão! Cód: 100");
      });
  }

  updateApportionment(){
    let newValeu = this.prizes[1].gathered + 7;
    let newPrizes: Prize;
    newPrizes = this.prizes[1];
    newPrizes.gathered = +newValeu;
    newPrizes.type = 1;

    this.configService.updateApportionment(newPrizes)
    .subscribe(data => {
      this.clearTicket();
    }, error => {
      alert("Houve algum erro de conexão! Cód: 101");
    });
  }
  // --- TICKET CREATION --- //

  clearTicket(){
    alert("Aposta Realizada!");

    this.ticket = 
    {
      id: 0, date: new Date(Date.now()), hour: new Date(Date.now()), userName: "", playerName: "", status: "inactivated", roundId: 0,
      results: ["", "", "", "", "", "", "", "", "", ""], resultToPass: "", userId: 1
    };

    this.makeFormatting();

    (<HTMLInputElement>document.getElementById("player-name")).value = "";

    this.modalCreate.hide();

    this.router.navigate(['/ticket']);

    //window.location.reload();

  }
}
