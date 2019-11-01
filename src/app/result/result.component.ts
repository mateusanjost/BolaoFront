import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';
//import { Team } from '../team.interface';
import { Round } from '../round.interface';
import { Game } from '../game.interface';
import { ResponseGame } from '../response-game.class';
import { Prize } from '../prize.interface';
import { Bet } from '../bet.interface';
import { User } from '../user.interface';
import { Jurisdiction } from '../jurisdiction.interface';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  currentRound: Array<any>;
  winners: Array<any>;

  isLoaded: boolean = false;
  //teams: Team[];
  round: Round;
  allRounds: Round[];
  games: Game[];
  tickets: Bet[];
  ticketsUsed: Bet[] = [];
  users: User[];
  usersUsed: User[] = [];
  idRound: number;
  dateBegin: string;
  dateEnd: string;
  responseGames = new Array<ResponseGame>();
  finalTable: any[] = [];

  prizes: Prize;
  jackpot: string;
  prizeAmount: string;
  fullPrize: string;
  prizeSharing: string;

  constructor(private configService: ConfigService) {
    
  }

 ngOnInit() {
   //this.listTeams();
   this.getRounds();
   //this.getPrize();

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
    this.getWinners();
    //this.getGames();
   }, error => {
     console.log(error);
   })
 }

 getWinners(){
   this.configService.listRoundWinners(this.round.id)
   .subscribe(data => {
     this.winners = data;
     this.getBets();
   }, error => {
     console.log(error);
   });
 }

 getBets(){
   this.configService.getBets(this.round.id)
   .subscribe(data => {
     this.tickets = data;
     this.getUsers();
   }, error => {
     console.log(error);
   });
 }

 getUsers(){
   this.configService.listUsers()
   .subscribe(data => {
     this.users = data;
     this.getGames();
   }, error => {
     console.log(error);
   });
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

 initRound(){

   this.idRound = this.round.number;
   this.dateBegin = this.round.startDateTime.toString();
   this.dateEnd = this.round.endDateTime.toString();
   this.prizeSharing = this.winners[0].value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

   // filtering tickets and users, then mounting the table result
   for (let i = 0; i < this.winners.length; i++){
     this.ticketsUsed.push(this.tickets.find(x => x.id == this.winners[i].betId));
     this.usersUsed.push(this.users.find(x => x.id == this.tickets[i].userAdminId));
     this.finalTable.push(
       { "betId":this.winners[i].betId,
       "operator": this.usersUsed[i].name,
       "country": this.usersUsed[i].country,
       "city": this.usersUsed[i].city,
       "playerName": this.ticketsUsed[i].playerName
      });
    }

   let tempAmount = 0;
   for (let i = 0; i < this.winners.length; i++){
     tempAmount += this.winners[i].value;
   }
   this.prizeAmount = tempAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

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
     this.responseGames[i].result = this.games[i].homeTeamScore > this.games[i].awayTeamScore ? "1" : this.games[i].homeTeamScore < this.games[i].awayTeamScore ? "2" : "X";

   }
 }

  /*getPrize(){
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
  }*/

  /*getWinners() {
    
    let ticket1 = { num: "1032", operator: "AGENCIA01", country: "Brasil", city: "Rio de Janeiro", player: "Carlos H" };
    let ticket2 = { num: "1044", operator: "MN", country: "Brasil", city: "Manaus", player: "anônimo" };
    let ticket3 = { num: "1098", operator: "AGENCIA01", country: "Brasil", city: "Rio de Janeiro", player: "Juca" };

    this.winners = [ ticket1, ticket2, ticket3 ];

    this.prizeSharing = (this.prizes[0].gathered / this.winners.length).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }*/

  createJurisdiction(){

    let newJurisdiction: Jurisdiction;

    // this.configService.addJurisdiction(newJurisdiction).subscribe(response => {
    //   console.log(response);
    // }, error => { 
    //   console.log(error);
    // });
  }

  removeJurisdiction(jurisdictionId){
    // this.configService.removeJurisdiction(jurisdictionId).subscribe(response => {
    //   console.log(response);
    // }, error => { 
    //   console.log(error);
    // });
  }

}