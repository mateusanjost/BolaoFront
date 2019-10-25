import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl} from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';

import { ConfigService } from '../config.service';
import { Team } from '../team.interface';
import { Round } from '../round.interface';
import { Game } from '../game.interface';
import { ResponseGame } from '../response-game.class';

/*
class ResponseGame {
  
  idGame: number;
  teamHome: string;
  teamVisit: string;
  imgLogoTeamHome: string;
  imgLogoTeamVisit: string;
  dateBegin: string;
  hourBegin: string;
  dateEnd: string;
  hourEnd: string;

}*/

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
  teams: Team[];
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

  constructor(private configService: ConfigService) { }

  ngOnInit() {

    this.listTeams();
    
    setTimeout(() => {
      document.getElementById("spinner-loading").classList.add("hidden");
      this.initRound();
      this.isLoaded = true;
    }, 3000);
  }

  listTeams() {
    this.configService.listTeams()
    .subscribe(data => {
      this.teams = data;
      this.getLastRound();
    }, error =>{
      console.log(error);
    });
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
  
  /*getRound(){
    this.configService.getRound()
    .subscribe(data => {
      //this.allRounds = data;
      this.round = data[data.length - 2];
      this.getGames();
    }, error => {
      console.log(error);
    });
  }*/

  getGames(){
    this.configService.getGames(this.round.id)
    .subscribe(data => {
      this.games = data;
    }, error => {
      console.log(error);
    });
  }

  // will be used to get data from DB
  initRound(){
    // var str = "Hello world!";
    // var res = str.substring(1, 4);

    // console.log(res);

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
        '<th scope="row">' + this.games[i].id + '</th>'+
        '<td style="text-align: right">' + this.teams[team1].name + ' <img src="../../assets/image/' + this.teams[team1].fileDataId + '">' + '</td>'+
        '<td>'+ date +'<br/>'+ hour +'</td>'+
        '<td>' + ' <img src="../../assets/image/' + this.teams[team2].fileDataId + '">' + this.teams[team2].name + '</td>'+
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
      this.gamesConstruction[i].teamHome = this.teams[team1].name;
      this.gamesConstruction[i].teamVisit = this.teams[team2].name;
      this.gamesConstruction[i].idHome = this.teams[team1].id;
      this.gamesConstruction[i].idVisit = this.teams[team2].id;
      this.gamesConstruction[i].imgLogoTeamHome = this.teams[team1].imgLogo;
      this.gamesConstruction[i].imgLogoTeamVisit = this.teams[team2].imgLogo;
      }
    }

    if (!this.testForm){
      this.previewGames = "";
      this.gamesConstruction = new Array<ResponseGame>();
    }
    
  }

  confirmRound(){

    //this.responseGames = this.gamesConstruction;
    this.newRound = this.round;
    //this.newRound.id++;
    this.newRound.number++;
    this.newRound.startDateTime = this.gamesConstruction[0].dateBegin;
    this.newRound.endDateTime = this.gamesConstruction[9].hourEnd;
    //console.log(this.newRound);
    
    this.newGames = this.games;
    
    this.configService.createRound(this.newRound)
      .subscribe(data => {
        //this.newGames.id = data.id;
        for (let i = 0; i < this.gamesConstruction.length; i++){
          this.newGames[i].roundId = data.id;
          this.newGames[i].dateTime = this.gamesConstruction[i].dateBegin;
          this.newGames[i].homeTeamId = this.gamesConstruction[i].idHome;
          this.newGames[i].awayTeamId = this.gamesConstruction[i].idVisit;
          this.newGames[i].homeTeamScore = 0;
          this.newGames[i].awayTeamScore = 0;
          //console.log(this.newGames);
    
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
      }

    this.creatingNew = false;

    this.modalCreate.hide();
  }

  cancelingCreation(){
    this.creatingNew = false;
  }

  generateGames(){

    for(let i = 0; i < this.games.length; i++){
      this.responseGames[i] = new ResponseGame();
      this.responseGames[i].idGame = this.games[i].id;
      this.responseGames[i].teamHome = this.teams[this.games[i].homeTeamId - 1].name;
      this.responseGames[i].teamVisit = this.teams[this.games[i].awayTeamId - 1].name;
      this.responseGames[i].imgLogoTeamHome = this.teams[this.games[i].homeTeamId - 1].fileDataId;
      this.responseGames[i].imgLogoTeamVisit = this.teams[this.games[i].awayTeamId - 1].fileDataId;
      this.responseGames[i].dateBegin = this.games[i].dateTime;
      this.responseGames[i].hourBegin = this.games[i].dateTime;
      this.responseGames[i].dateEnd = this.games[i].dateTime;
      this.responseGames[i].hourEnd = this.games[i].dateTime;
    }
  }

}
