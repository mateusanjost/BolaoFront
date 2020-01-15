import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../config.service';
//import { Team } from '../team.interface';
import { Round } from '../round.interface';
import { Game } from '../game.interface';
import { ResponseGame } from '../response-game.class';
import { ModalDirective } from 'angular-bootstrap-md';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-post-result',
  templateUrl: './post-result.component.html',
  styleUrls: ['./post-result.component.scss']
})
export class PostResultComponent implements OnInit {
  @ViewChild('frame', { static: true }) modalPost: ModalDirective;

  currentRound: Array<any>;
  postingOk: boolean = false;
  msgFinalResult: string = "";
  isLoaded: boolean = false;
  //teams: Team[];
  round: Round;
  games: Game[];
  newGames: Game[];
  idRound: number;
  dateBegin: string;
  dateEnd: string;
  responseGames = new Array<ResponseGame>();

  constructor(private configService: ConfigService, private appComponent: AppComponent) {
    
   }

  ngOnInit() {
    this.getLastRound();
    /*this.listTeams();

    setTimeout(() => {
      document.getElementById("spinner-loading").classList.add("hidden");
      this.initRound();
      this.isLoaded = true;
    }, 3000);*/

  }

  /*listTeams() {
    this.configService.listTeams()
    .subscribe(data => {
      this.teams = data;
      this.getLastRound();
    }, error =>{
      console.log(error);
    });
  }*/

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
      this.games.forEach(x => {    
        console.log(x);
        //x.matchResult = 'X';
      })
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
      // object to show the response to user
      this.responseGames[i] = new ResponseGame();
      this.responseGames[i].idGame = this.games[i].id;
      this.responseGames[i].teamHome = this.games[i].homeName;
      this.responseGames[i].teamVisit = this.games[i].awayName;
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

  checkResult(){
    this.msgFinalResult = "";
    let test: boolean = true;
    this.postingOk = true;

    // object to put the new data into DB
    this.newGames = this.games;

    for (let i = 0; i < 10; i++){
      let homeScore = (<HTMLInputElement>document.getElementById("home-score"+i)).value;
      let visitScore = (<HTMLInputElement>document.getElementById("visit-score"+i)).value;
      this.newGames[i].homeTeamScore = +homeScore;
      this.newGames[i].awayTeamScore = +visitScore;
      let currentResult = 'X';
      if (homeScore > visitScore) {
        currentResult = '1';
      }
      else if (homeScore <  visitScore){
        currentResult = '2';
      }
//      currentResult = (<HTMLInputElement>document.getElementById(result)).value;

      if (currentResult == ""){
        test = false;
      }
      else {
        this.msgFinalResult += this.responseGames[i].teamHome + ' '+ homeScore +' X ' + visitScore + ' '+ this.responseGames[i].teamVisit +
         ': ' + currentResult + '<br/>';
      }

      if (!test){
        this.msgFinalResult = "";
        this.postingOk = false;
      }
        
    }

  }

  confirmResults(){
    this.isLoaded = false;
    this.modalPost.hide();
    
    // call the server function
    this.configService.updateMatches(this.newGames)
    .subscribe(data => {
      //alert("Resultados postados com sucesso!");
      this.appComponent.msgStandard("Resultado Postado", "Operação realizada com sucesso!", 3);
      this.ngOnInit();
    }, error =>{
      console.log(error);
      //alert("Não postado por algum erro de conexão!");
      this.appComponent.msgStandard("Resultado Não Postado", "Operação Não Realizada!", 4);
      this.ngOnInit();
    });

    this.postingOk = false;

  }

  changeResult(i){
    let homeTeam = (<HTMLInputElement>document.getElementById("home-score"+i)).value;
    let awayTeam = (<HTMLInputElement>document.getElementById("visit-score"+i)).value;
    let matchResult = (<HTMLInputElement>document.getElementById("match-result"+i)).value;
    if(homeTeam > awayTeam)
      matchResult = '1';
    else if (homeTeam  < awayTeam)  
      matchResult = '2';
    else
      matchResult = 'X';
  }
}
