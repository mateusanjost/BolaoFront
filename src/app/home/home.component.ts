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
import { InteractionService } from '../interaction.service';
import { TranslateService } from '@ngx-translate/core';
import { ThrowStmt } from '@angular/compiler';
import { Banner } from '../banner.interface';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('frame2', { static: true }) modalCreate: ModalDirective;
  @ViewChild('frame3', { static: true }) modalFinishBet: ModalDirective;
  @ViewChild('frame4', { static: true }) modalPrint: ModalDirective;
  @ViewChild('frame5', { static: true }) modalWhatsapp: ModalDirective;
  betForm: FormGroup;

  isLogged: boolean = false;
  htmlToAdd: any;
  whatsappHead: string;
  whatsappBody: string;
  round: Round;
  games: Game[];
  bannersList: Banner[] = [];
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
  roundValue: string;

  ticket = {
    id: 0, date: new Date(Date.now()), hour: new Date(Date.now()), userName: "", playerName: "", status: "inactivated", roundId: 0, roundNum: 0,
    results: ["", "", "", "", "", "", "", "", "", ""],  resultToPass: "", userId: 1, value: 0
  };

  message = this.translate.instant("pg-home.required-results");

    constructor(private interactionService: InteractionService, private configService: ConfigService,
      private appComponent: AppComponent, private router: Router, private msgService: MessengerService,
      private translate: TranslateService) {
    this.isLogged = appComponent.isLogged;
    this.translate.setDefaultLang(this.appComponent.activeLang);
  }

  ngOnInit() {
      this.interactionService.homeVisibleRound.subscribe(round => {
          if(round != null) { this.setRound(round); } });
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
      this.roundValue = this.round.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }, error =>{
      console.log(error);
    });
  }

  getLastRound(){
    this.configService.getLastRound()
      .subscribe(data => {
        this.setRound(data);
    }, error => {
      console.log(error);
    });
  }

  setRound(round: Round){
    this.round = round;
    this.getGames();
    //this.getOwnBanners();
    this.getMasterParent();
  }

  getMasterParent(){
    let userId = 1;
    if (!this.appComponent.userAdmin){
      userId = 1;
    }
    else {
      userId = this.appComponent.userAdmin.id;
    }

    this.configService.getMasterParent(userId)
    .subscribe(data => {
      this.getOwnBanners(data.id);
    }, error => {
      this.appComponent.msgStandard(this.translate.instant("pg-banners.operation-fail"), this.translate.instant("pg-banners.load-fail-info"), 4);
      console.log(error);
    });
  }

  getOwnBanners(masterParentId: number){
    this.configService.getOwnBanners(masterParentId)
    .subscribe(data => {
      this.bannersList = data;
    }, error => {
      this.appComponent.msgStandard(this.translate.instant("pg-banners.operation-fail"), this.translate.instant("pg-banners.load-fail-info"), 4);
      console.log(error);
    });
  }

  getGames(){
    this.configService.getGames(this.round.id)
    .subscribe(data => {
      this.games = data;
      this.initRound();
      let spinner = document.getElementById("spinner-loading");
      if(spinner != null) { spinner.classList.add("hidden"); }
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
    for (let i = 0; i < this.games.length; i++) {
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
        this.whatsappBody = "";
        this.ticket.resultToPass = "";
        for (let i = 0; i < this.games.length; i++){
          let result = "";
          if (this.ticket.results[i] == '1'){
            //result = this.responseGames[i].teamHome + ' [1]';
            result = ' 1';
            this.ticket.resultToPass += '1';
            this.ticket.resultToPass += i < (this.games.length - 1) ? '|' : '';
          }
          else if (this.ticket.results[i] == 'X'){
            //result = "EMPATE [X]";
            result = " X";
            this.ticket.resultToPass += 'X';
            this.ticket.resultToPass += i < (this.games.length - 1) ? '|' : '';
          }
          else {
            //result = this.responseGames[i].teamVisit + ' [2]';
            result = ' 2';
            this.ticket.resultToPass += '2';
            this.ticket.resultToPass += i < (this.games.length - 1) ? '|' : '';
          }
          msgResult += '<div class="row"><div class="col-9">' +
           this.responseGames[i].teamHome + ' - ' + this.responseGames[i].teamVisit +
           ' : </div><div class="col-3">' + result + '</div></div>';
           this.whatsappBody += this.responseGames[i].teamHome + ' - ' + this.responseGames[i].teamVisit + result + "%0A";
        let showDateHour = new Date(this.ticket.date);
        this.htmlToAdd =
        /*'id bilhete: '+ this.ticket.id + ' - */this.translate.instant("pg-home.round")+': ' + this.ticket.roundNum + '<p/>' +
        ' ' + this.translate.instant("pg-home.creation") +': ' + showDateHour.getDate()+'/'+ (showDateHour.getMonth()+1) + ' - ' + showDateHour.getHours()+':'+ showDateHour.getMinutes() + ' - ' + this.translate.instant("pg-home.value") + ': '+ this.roundValue + '<br/>'+
        this.translate.instant("pg-home.operator")+ ': ' + this.appComponent.userAdmin.login + ' - ' + this.translate.instant("pg-home.player") + ': ' + (this.ticket.playerName == "" ? this.translate.instant("pg-home.anonymous"): this.ticket.playerName) + '<br/><br/>'+
        msgResult;
        this.whatsappHead = this.translate.instant("pg-home.creation") + ': ' + showDateHour.getDate()+'/'+ (showDateHour.getMonth()+1) + ' - ' + showDateHour.getHours()+':'+ showDateHour.getMinutes() + '%0A'+
        this.translate.instant("pg-home.operator") +': ' + this.appComponent.userAdmin.login + ' - ' + this.translate.instant("pg-home.player") + ': ' + this.ticket.playerName + " - " + this.translate.instant("pg-home.value") + ": " + this.roundValue + '%0A%0A';
        }
      }
      else {
        this.htmlToAdd = this.translate.instant("pg-home.required-results");
      }
    }
  }

  checkTicket(playerName: string) {
    let test: boolean = true;

    // check whether all results was choosen
    for (let i = 0; i < this.games.length; i++) {
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
      this.ticket.value = this.round.value;
    }

    this.isChecked = test;

    return test;

  }

  postTicket(){
    this.modalCreate.hide();
    this.isLoaded = false;

    let userId = this.appComponent.userAdmin.id;

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
          this.appComponent.msgStandard(this.translate.instant("pg-home.operation-failed"), this.translate.instant("pg-home.operation-failed-info"), 4);
          console.log(error);
          this.ngOnInit();
        });
      }
      else {
        //alert("Você não possui crédito suficiente para criar aposta.");
        this.appComponent.msgStandard(this.translate.instant("pg-home.operation-failed"), this.translate.instant("pg-home.no-enough-credit"), 4);
        this.ngOnInit();
      }
    }, error => {
      //alert("Ação não realizada! Erro interno. ("+ error.error +")");
      this.appComponent.msgStandard(this.translate.instant("pg-home.operation-failed"), this.translate.instant("pg-home.operation-failed-info"), 4);
      console.log(error);
    });
  }

  updateUserCredit(userId: number, newUserCredit: number){
    let transactionType = 3;
    this.configService.updateUserCredit(userId, this.round.value, transactionType)
    .subscribe(data => {
      this.updateJackpot();
    }, error => {
      //alert("Erro de conexão! Cód: 103");
      this.appComponent.msgStandard(this.translate.instant("pg-home.operation-failed"), this.translate.instant("pg-home.operation-failed-info"), 4);
      this.ngOnInit();
    });
  }

  updateJackpot(){
    //let newValeu = this.prizes[0].gathered + 2;
    let newValeu = this.prizes[0].gathered + (this.round.value * 0.2);
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
        this.appComponent.msgStandard(this.translate.instant("pg-home.operation-failed"), this.translate.instant("pg-home.operation-failed-info"), 4);
        this.ngOnInit();
      });
  }

  updateApportionment(){
    //let newValeu = this.prizes[1].gathered + 7;
    let newValeu = this.prizes[1].gathered + (this.round.value * 0.6);
    let newPrizes: Prize;
    newPrizes = this.prizes[1];
    newPrizes.gathered = +newValeu;
    newPrizes.type = 1;

    this.configService.updateApportionment(newPrizes)
    .subscribe(data => {
      this.modalFinishBet.show();
    }, error => {
      this.appComponent.msgStandard(this.translate.instant("pg-home.operation-failed"), this.translate.instant("pg-home.operation-failed-info"), 4);
      this.ngOnInit();
    });
  }

  closeBetModal(){
    //this.modalFinishBet.hide();
    this.router.navigate(['/ticket']);
  }

  printTicket(){
    window.open('http://www.jogobrasil.com.br/print', "", "width=360,height=700");
    //window.open('/print', "", "width=360,height=700");
    this.router.navigate(['/ticket']);
  }

  showModalWhatsapp(){
    this.modalFinishBet.hide();
    this.modalWhatsapp.show();
  }

  closeWhatsappModal(){
    this.modalWhatsapp.hide();
    this.router.navigate(['/ticket']);
  }

  whatsappTicket(cel: string){
    cel = cel.trim();
    
    window.open('https://api.whatsapp.com/send?phone='+ cel + '&text='+ this.whatsappHead + this.whatsappBody);
    this.router.navigate(['/ticket']);
  }

}
