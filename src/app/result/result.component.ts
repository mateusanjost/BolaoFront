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
import { AppComponent } from '../app.component';
import { TranslateService } from '@ngx-translate/core';

class TableStructure {
  betId: number;
  adminName: string;
  playerName: string;
}

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  isLoaded: boolean = false;
  roundsPosted: Round[] = [];
  games: Game[] = [];
  isLoadingGames: boolean = false;
  winners: any[] = [];
  bets: Bet[] = [];
  totalPrize: string;
  totalWinners: number;
  eachValue: string;
  eachHits: number;
  users: User[] = [];
  tableResume: TableStructure[] = [];
 
  constructor(private configService: ConfigService, private appComponent: AppComponent,
    private translate: TranslateService) {
      this.translate.setDefaultLang(this.appComponent.activeLang);
  }

  ngOnInit() {
    this.getRoundsFinished();
  }

  getRoundsFinished(){
    this.configService.getRoundsPosted()
    .subscribe(data => {
      this.roundsPosted = data;
      document.getElementById("spinner-loading").classList.add("hidden");
      this.isLoaded = true;
    }, error => {
      console.log(error);
      this.appComponent.msgStandard(this.translate.instant("pg-result.failed-load"), this.translate.instant("pg-result.failed-load-info") +
      this.translate.instant("pg-result.assistence-contact"), 4)
    })
  }

  loadGames(roundId: number){
    this.isLoadingGames = true;
    this.games = [];

    this.configService.getGames(roundId)
    .subscribe(data => {
      this.games = data;
      this.loadWinners(roundId);
    }, error => {
      console.log(error);
      this.appComponent.msgStandard(this.translate.instant("pg-result.failed-load"), this.translate.instant("pg-result.failed-load-info") +
      this.translate.instant("pg-result.assistence-contact"), 4);
    });
  }

  loadWinners(roundId: number){
    this.configService.listRoundWinners(roundId)
    .subscribe(data => {
      this.winners = data;
      this.getBets(roundId);
    }, error => {
      this.appComponent.msgStandard(this.translate.instant("pg-result.failed-load"), this.translate.instant("pg-result.failed-load-info") +
      this.translate.instant("pg-result.assistence-contact"), 4);
      console.log(error);
    });
  }

  getBets(roundId: number){
    this.configService.getAllBets(roundId)
    .subscribe(data => {
      this.bets = data;
      this.getUsers();
    }, error => {
      this.appComponent.msgStandard(this.translate.instant("pg-result.failed-load"), this.translate.instant("pg-result.failed-load-info") +
      this.translate.instant("pg-result.assistence-contact"), 4);
      console.log(error);
    });    
  }

  getUsers(){
    this.configService.listUsers()
    .subscribe(data => {
      this.users = data;
      this.constructTable();
    }, error => {
      this.appComponent.msgStandard(this.translate.instant("pg-result.failed-load"), this.translate.instant("pg-result.failed-load-info") +
      this.translate.instant("pg-result.assistence-contact"), 4);
      console.log(error);
    })
  }

  constructTable(){
    if (this.winners.length > 0) {
      this.totalPrize = (this.winners.length * this.winners[0].value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      this.eachValue = (this.winners[0].value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      this.eachHits = this.winners[0].points;

      let filteredBets: Bet[] = [];
      this.winners.forEach(element => {
        filteredBets.push(this.bets.find(x => x.id == element.betId));
      });

      let filteredUsers: User[] = [];
      filteredBets.forEach(element => {
        filteredUsers.push(this.users.find(x => x.id == element.userAdminId));
      });

      this.tableResume = [];
      this.winners.forEach((element, index) => {
        this.tableResume.push(new TableStructure());
        this.tableResume[index].betId = this.winners[index].betId;
        this.tableResume[index].adminName = filteredUsers[index].login;
        this.tableResume[index].playerName = filteredBets[index].playerName;
      });
    } else {
      this.appComponent.msgStandard(this.translate.instant("pg-result.exception"), this.translate.instant("pg-result.exception-info") +
      this.translate.instant("pg-result.exception-possibility"), 2);
    }    

    this.isLoadingGames = false;
    document.getElementById("spinner-loading2").classList.add("hidden");
    
  }

  result(homeScore: number, awaySocore: number){
    let ret = "X";
    if (homeScore > awaySocore){
      ret = "1";
    } else if (homeScore < awaySocore){
      ret ="2";
    }
    return ret;
  }

}
