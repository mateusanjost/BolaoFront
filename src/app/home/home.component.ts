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
import { NgForm } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../user.interface';
import { MessengerService } from 'src/services/messenger.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('frame2', { static: true }) modalCreate: ModalDirective;
  @ViewChild('frame3', { static: true }) modalFinishBet: ModalDirective;
  @ViewChild('frame4', { static: true }) modalPrint: ModalDirective;
  betForm: FormGroup;

  isLogged: boolean = false;
  htmlToAdd: any;
  currentRound = new Array<any>();
  //teams: Team[];
  round: Round;
  games: Game[];
  user: User = this.appComponent.userAdmin;
  isLoaded: boolean = false;
  isChecked: boolean = false;
  idRound: number;
  dateBegin: string;
  dateEnd: string;
  responseGames = new Array<ResponseGame>();
  prizes: Prize;
  jackpot: string;
  prizeAmount: string;
  fullPrize: string;

  ticket = {
    id: 0, date: new Date(Date.now()), hour: new Date(Date.now()), userName: "", playerName: "", status: "inactivated", roundId: 0, roundNum: 0,
    results: ["", "", "", "", "", "", "", "", "", ""],  resultToPass: "", userId: 1
  };

  message = "Obrigatório escolher resultado para todos os jogos.";

  constructor(private configService: ConfigService, private appComponent: AppComponent, private router: Router, private msgService: MessengerService) {
    this.isLogged = appComponent.isLogged;
  }

  ngOnInit() {
    this.isLogged = this.appComponent.isLogged;
    this.getLastRound();
    this.getPrize();

    this.betForm = new FormGroup({
      user: new FormControl('', { validators: [Validators.required] })
    });
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

  getUser(){
    this.configService.getUser(this.appComponent.userAdmin.id)
    .subscribe(data => {
      this.user = data;
    }, error => {
      console.log(error);
    });
  }

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
  onOpen(form: NgForm) {
    this.isChecked = false;
    this.modalCreate.show();

    // allways when opens the modal to confirm the bet, must be logged in
    this.isLogged = this.appComponent.isLogged;

    // once logged in, verify if is everything allright with the current ticket; if so, show the ticket
    if (this.isLogged) {
      if (this.checkTicket(form.value.player_name)) {
        let msgResult = "";
        this.ticket.resultToPass = "";
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
        /*'id bilhete: '+ this.ticket.id + ' - */'rodada: ' + this.ticket.roundNum + '<p/>' +
        //' data: ' + this.ticket.date + ' - hora: ' + this.ticket.hour + '<br/>'+
        ' criação: ' + showDateHour.getDate()+'/'+ (showDateHour.getMonth()+1) + ' - ' + showDateHour.getHours()+':'+ showDateHour.getMinutes() + '<br/>'+
        'operador: ' + this.appComponent.userAdmin.login + ' - jogador: ' + this.ticket.playerName + '<br/><br/>'+
        msgResult;
        }
      }
      else {
        this.htmlToAdd = 'Obrigatório escolher <b>todos os resultados</b>.';
      }
    }
  }

  checkTicket(playerName: string) {
    let test: boolean = true;

    // check whether all results was choosen
    for (let i = 0; i < 10; i++) {
      if (this.ticket.results[i] == "") {
        test = false;
      }
    }

    // check if is there the player name; if so, fullfill the ticket object to go ahead
    //if (test && playerName != undefined) {
    if (test) {
      this.ticket.id = 10;
      this.ticket.roundId = this.round.id;
      this.ticket.roundNum = this.round.number;
      this.ticket.playerName = playerName;
      this.ticket.date = new Date(Date.now());
      this.ticket.hour = new Date(Date.now());
      this.ticket.status = "activated";
      this.ticket.userId = this.appComponent.userAdmin.id;
    }

    this.isChecked = test;

    return test;

  }

  postTicket(){
    this.modalCreate.hide();
    this.isLoaded = false;

    let userId = this.appComponent.userAdmin.id;
    //let newUserCredit = this.appComponent.userAdmin.credit - 10;
    //this.getUser();

    this.configService.getUser(this.appComponent.userAdmin.id)
    .subscribe(data => {
      let newUserCredit = data.credit - 10;
      if (newUserCredit >= 0){
        this.configService.postBet(this.ticket)
        .subscribe(data => {
          this.appComponent.betIdPrint = data.id;
          this.appComponent.userAdmin.credit = newUserCredit;
          this.updateUserCredit(userId, newUserCredit);
        }, error => {
          //alert("Erro de conexão! Cód: 99");
          this.appComponent.msgStandard("Operação Não Realizada", "Erro na realização da aposta.", 4);
          console.log(error);
          this.ngOnInit();
        });
      }
      else {
        //alert("Você não possui crédito suficiente para criar aposta.");
        this.appComponent.msgStandard("Operação Não Realizada", "Você não possui crédito suficiente para criar aposta.", 4);
        this.ngOnInit();
      }
    }, error => {
      //alert("Ação não realizada! Erro interno. ("+ error.error +")");
      this.appComponent.msgStandard("Operação Não Realizada", "Erro na realização da aposta.", 4);
      console.log(error);
    });
  }

  updateUserCredit(userId: number, newUserCredit: number){
    this.configService.updateUserCredit(userId, newUserCredit)
    .subscribe(data => {
      this.updateJackpot();
    }, error => {
      //alert("Erro de conexão! Cód: 103");
      this.appComponent.msgStandard("Operação Não Realizada", "Erro na finalização da aposta.", 4);
      this.ngOnInit();
    });
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
        //alert("Houve algum erro de conexão! Cód: 100");
        this.appComponent.msgStandard("Operação Não Realizada", "Erro na finalização da aposta.", 4);
        this.ngOnInit();
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
      //this.clearTicket();
      this.modalFinishBet.show();
    }, error => {
      //alert("Houve algum erro de conexão! Cód: 101");
      this.appComponent.msgStandard("Operação Não Realizada", "Erro na finalização da aposta.", 4);
      this.ngOnInit();
    });
  }
  // --- TICKET CREATION --- //

  /*
  NOT USED ANYMORE
  clearTicket(){
    //alert("Aposta Realizada!");
    //this.msgService.messengerBox();
    this.modalFinishBet.show();
    //this.appComponent.msgStandard("Aposta Realizada", "Bilhete criado com sucesso!", 3);
    
    //window.print();
    //window.open('http://localhost:4200/print', "", "width=360,height=700");
    // modal to print
    //window.open('http://www.jogobrasil.com.br/print', "", "width=360,height=700");

    //this.printTicket();

    //this.router.navigate(['/ticket']);
    
  }
  */

  closeBetModal(){
    //this.modalFinishBet.hide();
    this.router.navigate(['/ticket']);
  }

  printTicket(){
    window.open('http://www.jogobrasil.com.br/print', "", "width=360,height=700");
    this.router.navigate(['/ticket']);
  }

}