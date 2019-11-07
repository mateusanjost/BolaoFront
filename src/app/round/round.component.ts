import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl} from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';

import { ConfigService } from '../config.service';
//import { Team } from '../team.interface';
import { Round } from '../round.interface';
import { Game } from '../game.interface';
import { ResponseGame } from '../response-game.class';
import { Router } from '@angular/router';

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.scss']
})
export class RoundComponent implements OnInit {
  @ViewChild('frame', { static: true }) modalCreate: ModalDirective;

  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());

  idRound: number;
  dateBegin: string;
  hourBegin: string;
  dateEnd: string;
  hourEnd: string;
  //teams: Team[];
  round: Round;
  newRound: Round;
  games: Game[];
  newGames = new Array<Game>();
  responseGames = new Array<ResponseGame>();
  gamesConstruction = new Array<ResponseGame>();
  creatingNew: boolean = false;
  testForm: boolean = false;
  previewGames: string = "";
  isLoaded: boolean = false;
  errorCreation: boolean = false;

  constructor(private configService: ConfigService, private router: Router) { }

  ngOnInit() {
    this.getLastRound();
  }

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
    this.hourBegin = this.round.startDateTime.toString();
    this.dateEnd = this.round.endDateTime.toString();
    this.hourEnd = this.round.endDateTime.toString();

    this.generateGames();
  }

  creatingRound(){
    this.creatingNew = true;
  }

  checkRound(){
    this.gamesConstruction = new Array<ResponseGame>();
    this.testForm = true;
    this.previewGames = "";
    let roundNum = (<HTMLInputElement>document.getElementById("round-num")).value
    for (let i = 0; i < 10; i++){
      let team1 = (<HTMLInputElement>document.getElementById("teamA"+(i))).value;
      let team2 = (<HTMLInputElement>document.getElementById("teamB"+(i))).value;
      let date = (<HTMLInputElement>document.getElementById("mat-input-"+(i))).value;
      let hour = (<HTMLInputElement>document.getElementById("hour"+(i))).value;

      if(roundNum == "" || team1 == "" || team2 == "" || date == "" || hour == ""){
        this.testForm = false;
      }
      else {
        this.previewGames +=
      '<tr>' +
        '<th scope="row">' + (i + 1) + '</th>'+
        '<td style="text-align: right">' + team1 + '</td>'+
        '<td>'+ date +'<br/>'+ hour +'</td>'+
        '<td>' + team2 + '</td>'+
      '</tr>';
      
      this.gamesConstruction[i] = new ResponseGame();
      this.gamesConstruction[i].idGame = i + 1;
      let day = date.substring(0, 2);
      let month = date.substring(5, 3);
      let year = date.substring(10, 6);
      let newDate: string = year + '-' + month + '-' + day + ' ' + hour;
      this.gamesConstruction[i].dateBegin = new Date(newDate);
      this.gamesConstruction[i].hourBegin = new Date(newDate);
      this.gamesConstruction[i].dateEnd = new Date(newDate);
      this.gamesConstruction[i].hourEnd = new Date(newDate);
      this.gamesConstruction[i].hourEnd.setTime(this.gamesConstruction[i].dateBegin.getTime() + (2*60*60*1000));
      this.gamesConstruction[i].teamHome = team1;
      this.gamesConstruction[i].teamVisit = team2;
      this.gamesConstruction[i].idHome = 100;
      this.gamesConstruction[i].idVisit = 100;
      this.gamesConstruction[i].imgLogoTeamHome = team1 + ".png";
      this.gamesConstruction[i].imgLogoTeamVisit = team2 + ".png";
      }
    }

    if (!this.testForm){
      this.previewGames = "";
      this.gamesConstruction = new Array<ResponseGame>();
    }
    
  }

  confirmRound(){
    this.modalCreate.hide();
    this.isLoaded = false;
    
    this.newRound = this.round;
    this.newRound.number++;
    this.newRound.startDateTime = this.gamesConstruction[0].dateBegin;
    this.newRound.endDateTime = this.gamesConstruction[9].hourEnd;
    
    this.newGames = this.games;
    
    this.configService.createRound(this.newRound)
      .subscribe(data => {
        for (let i = 0; i < this.gamesConstruction.length; i++){
          this.newGames[i].roundId = data.id;
          this.newGames[i].dateTime = this.gamesConstruction[i].dateBegin;
          this.newGames[i].homeTeamId = this.gamesConstruction[i].idHome;
          this.newGames[i].homeName = this.gamesConstruction[i].teamHome;
          this.newGames[i].awayTeamId = this.gamesConstruction[i].idVisit;
          this.newGames[i].awayName = this.gamesConstruction[i].teamVisit;
          this.newGames[i].homeTeamScore = 0;
          this.newGames[i].awayTeamScore = 0;
    
          this.configService.createGame(this.newGames[i])
            .subscribe(data => {
              // creationg OK
            }, error => {
              console.log("internal code: 102 " + error);
              this.errorCreation = true;
            });
        }
      }, error => {
        console.log("internal code: 101 " + error);
        this.errorCreation = true;
      });


      if (this.errorCreation){
        alert("Não foi possível criar a rodada! Erro interno.");
        this.errorCreation = false;
      }
      else {
        alert("Rodada Criada com Sucesso!");
        this.ngOnInit();
        //this.router.navigate(['/home']);
      }

    this.creatingNew = false;
  }

  cancelingCreation(){
    this.creatingNew = false;
  }

  generateGames(){

    for(let i = 0; i < this.games.length; i++){
      this.responseGames[i] = new ResponseGame();
      this.responseGames[i].idGame = this.games[i].id;
      this.responseGames[i].teamHome = this.games[i].homeName;
      this.responseGames[i].teamVisit = this.games[i].awayName;
      this.responseGames[i].imgLogoTeamHome = this.games[i].homeName + ".png";
      this.responseGames[i].imgLogoTeamVisit = this.games[i].awayName + ".png";
      this.responseGames[i].dateBegin = this.games[i].dateTime;
      this.responseGames[i].hourBegin = this.games[i].dateTime;
      this.responseGames[i].dateEnd = this.games[i].dateTime;
      this.responseGames[i].hourEnd = this.games[i].dateTime;
    }
  }

}
