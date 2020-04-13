import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../config.service';
import { Round } from '../round.interface';
import { Game } from '../game.interface';
import { ModalDirective } from 'angular-bootstrap-md';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-post-result',
  templateUrl: './post-result.component.html',
  styleUrls: ['./post-result.component.scss']
})
export class PostResultComponent implements OnInit {
  @ViewChild('frame', { static: true }) modalPost: ModalDirective;

  isLoaded: boolean = false;
  isLoadingGames: boolean = false;
  roundsFinished: Round[] = [];
  games: Game[] = [];

  constructor(private configService: ConfigService, private appComponent: AppComponent,
    private router: Router, private translate: TranslateService) {
      this.translate.setDefaultLang(this.appComponent.activeLang);
   }

  ngOnInit() {
    this.games = [];
    this.getRoundsFinished();
  }

  getRoundsFinished(){
    this.configService.getRoundsFinished()
    .subscribe(data => {
      this.roundsFinished = data;
      document.getElementById("spinner-loading").classList.add("hidden");
      this.isLoaded = true;
    }, error => {
      console.log(error);
      this.appComponent.msgStandard(this.translate.instant("pg-post-result.failed-round"), this.translate.instant("pg-post-result.failed-round-info") +
      this.translate.instant("pg-post-result.assistence-contact"), 4)
    })
  }

  loadGames(roundId: number){
    this.games = [];
    this.isLoadingGames = true;
    document.getElementById("spinner-loading2").classList.remove("hidden");

    this.configService.getGames(roundId)
    .subscribe(data => {
      this.getBetradarResults(data);
    }, error => {
      console.log(error);
      this.appComponent.msgStandard(this.translate.instant("pg-post-result.failed-matches"), this.translate.instant("pg-post-result.failed-matches-info") +
      this.translate.instant("pg-post-result.assistence-contact"), 4)
    });
  }

  getBetradarResults(currentGames: Game[]) {
    this.configService.getBetRadarResults(currentGames)
    .subscribe(data => {
      this.games = data;

      this.isLoadingGames = false;
      document.getElementById("spinner-loading2").classList.add("hidden");
    }, error => {
      this.appComponent.msgStandard(this.translate.instant("pg-post-result.failed-post"), this.translate.instant("pg-post-result.failed-post-info") +
      this.translate.instant("pg-post-result.assistence-contact"), 4);
      console.log(error);
    });
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

  onChange(homeOrAway: string, indexGame: number, score: number){
    if (homeOrAway == "a"){
      this.games[indexGame].homeTeamScore = score;
    } else {
      this.games[indexGame].awayTeamScore = score;
    }

    this.result(this.games[indexGame].homeTeamScore, this.games[indexGame].awayTeamScore);
  }

  postResult(){
    this.configService.postResult(this.games)
    .subscribe(data => {
      this.appComponent.msgStandard(this.translate.instant("pg-post-result.result-posted"), this.translate.instant("pg-post-result.result-posted-info"), 3);
      this.appComponent.warningBadge -= 1;
      this.modalPost.hide();
      this.ngOnInit();
    }, error => {
      this.appComponent.msgStandard(this.translate.instant("pg-post-result.failed-post"), this.translate.instant("pg-post-result.failed-post-info") +
      this.translate.instant("pg-post-result.assistence-contact"), 4);
      console.log(error);
    });
  }

}
