import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';
import { Team } from '../team.interface';
import { Round } from '../round.interface';
import { Game } from '../game.interface';
import { ResponseGame } from '../response-game.class';
import { Prize } from '../prize.interface';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  currentRound: Array<any>;
  winners: Array<any>;

  isLoaded: boolean = false;
  teams: Team[];
  round: Round;
  allRounds: Round[];
  games: Game[];
  idRound: number;
  dateBegin: string;
  dateEnd: string;
  responseGames = new Array<ResponseGame>();

  prizes: Prize;
  jackpot: string;
  prizeAmount: string;
  fullPrize: string;
  prizeSharing: string;

  constructor(private configService: ConfigService) {
    
  }

 ngOnInit() {
   this.listTeams();
   this.getPrize();
  //  setTimeout(() => {
  //    document.getElementById("spinner-loading").classList.add("hidden");
  //    this.initRound();
  //    this.isLoaded = true;
  //  }, 3000);

 }

 listTeams() {
   this.configService.listTeams()
   .subscribe(data => {
     this.teams = data;
     this.getRounds();
   }, error =>{
     console.log(error);
   });
 }

 getRounds(){
   this.configService.getRound()
   .subscribe(data => {
     this.getPreviusRound(data[data.length - 2].id);
   }, error => {
     console.log(error);
   });
 }

 getPreviusRound(roundId: number){
   this.configService.getSpecificRound(roundId)
   .subscribe(data => {
    this.round = data;
    this.getGames();
   }, error => {
     console.log(error);
   })
 }

 getGames(){
   this.configService.getGames(this.round.id)
   .subscribe(data => {
     this.games = data;
     document.getElementById("spinner-loading").classList.add("hidden");
     this.initRound();
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
     this.responseGames[i].teamHome = this.teams[this.games[i].homeTeamId - 1].name;
     this.responseGames[i].teamVisit = this.teams[this.games[i].awayTeamId - 1].name;
     this.responseGames[i].imgLogoTeamHome = this.teams[this.games[i].homeTeamId - 1].fileDataId;
     this.responseGames[i].imgLogoTeamVisit = this.teams[this.games[i].awayTeamId - 1].fileDataId;
     this.responseGames[i].homeTeamScore = this.games[i].homeTeamScore;
     this.responseGames[i].awayTeamScore = this.games[i].awayTeamScore;
     this.responseGames[i].dateBegin = this.games[i].dateTime;
     this.responseGames[i].hourBegin = this.games[i].dateTime;
     this.responseGames[i].dateEnd = this.games[i].dateTime;
     this.responseGames[i].hourEnd = this.games[i].dateTime;
     this.responseGames[i].result = this.games[i].homeTeamScore > this.games[i].awayTeamScore ? "1" : this.games[i].homeTeamScore < this.games[i].awayTeamScore ? "2" : "X";

   }
 }

  getPrize(){
    this.configService.getPrize()
    .subscribe(data => {
      this.prizes = data;
      this.jackpot = (this.prizes[0].gathered).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      this.prizeAmount = (this.prizes[1].gathered).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      this.fullPrize = (this.prizes[0].gathered + this.prizes[1].gathered).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

      this.getWinners();
    }, error =>{
      console.log(error);
    });
  }

  getWinners() {
    
    let ticket1 = { num: "1032", operator: "AGENCIA01", country: "Brasil", city: "Rio de Janeiro", player: "Carlos H" };
    let ticket2 = { num: "1044", operator: "MN", country: "Brasil", city: "Manaus", player: "anônimo" };
    let ticket3 = { num: "1098", operator: "AGENCIA01", country: "Brasil", city: "Rio de Janeiro", player: "Juca" };

    this.winners = [ ticket1, ticket2, ticket3 ];

    this.prizeSharing = (this.prizes[0].gathered / this.winners.length).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

}