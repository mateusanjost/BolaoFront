import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';

import { ConfigService } from '../config.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

import { Match } from '../match.model';
import { BetradarComps } from '../betradar-comps';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Round } from '../round.interface';
import { Game } from '../game.interface';

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.scss']
})
export class RoundComponent implements OnInit {
  @ViewChild('frame', { static: true }) modalCreate: ModalDirective;

  match = new Match();
  dataArray = [];

  filteredOptions: Observable<BetradarComps[]>;

  formBetradar: FormGroup;
  betradarCompetitions: any;
  betradarMatches: any;
  tempGameId: number = 0;
  lastRound: Round;

  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  
  isLoaded: boolean = false;

  constructor(private configService: ConfigService, private appComponent: AppComponent, private router: Router) { }

  ngOnInit() {
    this.getLastRound();
    this.listBetradarCompetitions();
    
    this.formBetradar = new FormGroup({
      myControl: new FormControl('', Validators.required)
    });

  }

  getLastRound() {
    this.configService.getLastRound()
    .subscribe(data => {
      this.lastRound = data;
    }, error => {
      console.log(error);
    });
  }

  get myControl() {
    return this.formBetradar.get('myControl');
  }

  displayFn(competition?: BetradarComps): string | undefined {
    return competition ? competition.Mani : undefined;
  }

  private _filter(Mani: string): BetradarComps[] {
    const filterValue = Mani.toLowerCase();

    return this.betradarCompetitions.filter(comp => comp.Mani.toLowerCase().indexOf(filterValue) === 0);
  }

  // --- BETRADAR IMPLEMANTATION --- //
  
  listBetradarCompetitions(){
    this.configService.getBetRadarCompetitions()
    .subscribe(data => {
      this.betradarCompetitions = data;

      this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.Mani),
        map(Mani => Mani ? this._filter(Mani) : this.betradarCompetitions.slice())
      );

      document.getElementById("spinner-loading").classList.add("hidden");
      this.isLoaded = true;

    }, error => {
      console.log(error);
    });
  }

  seeGames(){
    let idCompetition = this.formBetradar.value.myControl.IdMani;
    this.configService.GetBetradarMatches(idCompetition)
    .subscribe(data => {
      this.betradarMatches = data;
    }, error => {
      console.log(error);
    });
  }

  checkExistingId(idMatch: number){
    let test: boolean = true;
    this.dataArray.forEach(element => {
      if (element.id == idMatch){
        test = false;
      }
    });

    return test;
  }

  checkCustomMatch(){
    let msg = "";
    let testCustomMatch: boolean = true;

    let dt = (<HTMLInputElement>document.getElementById("date-picker")).value;
    let hr = (<HTMLInputElement>document.getElementById("hour-input")).value;
    let gm = (<HTMLInputElement>document.getElementById("match-name")).value;

    if (dt == ""){
      testCustomMatch = false;
      msg = "O campo de data não pode ser vazio.";
    } else if (hr == "") {
      testCustomMatch = false;
      msg = "O campo de hora não pode ser vazio.";
    } else if (gm == "") {
      testCustomMatch = false;
      msg = "O nome do jogo precisa ser preenchido.";
    }

    if (!testCustomMatch){
      this.appComponent.msgStandard("Campo Obrigatório Vazio", msg, 4);
    }

    return testCustomMatch;

  }

  addGame(id: number, match: string, date: Date, hour: Date){
    let test: boolean = this.checkExistingId(id);
    
    if ((id != 0 && test) || (id == 0 && this.checkCustomMatch())){
      this.match = new Match();
      this.match.id = id;
      this.match.game = match;
      this.match.date = date;
      this.match.hour = hour;
      
      this.dataArray.push(this.match);
      
      if (this.dataArray.length == 10){
        this.appComponent.msgStandard("Limite Recomendado", "Chegou a 10 jogos.", 2);
      }

      // clear custom match
      if(id == 0){
        (<HTMLInputElement>document.getElementById("hour-input")).value = "";
        (<HTMLInputElement>document.getElementById("match-name")).value = "";
      }
    }  

  }

  removeGame(indexData: number){
    if (indexData > -1) {
      this.dataArray.splice(indexData, 1);
    }
  }

  onSubmit(){
    // extracting teams names and preparing object Games
    let newGames: Game[] = [];
    this.dataArray.forEach((element, index) => {
      let obj: any = { homeName: element.game, awayName: element.game }
      newGames.push(obj);
      let pos = element.game.indexOf("-");
      newGames[index].homeName = element.game.substring(0, pos - 1);
      newGames[index].awayName = element.game.substring(pos + 2);
      newGames[index].homeTeamId = 100;
      newGames[index].awayTeamId = 100;
      let day = element.date.substring(0, 2);
      let month = element.date.substring(3, 5);
      let year = element.date.substring(11, 6) + "20";
      newGames[index].dateTime = new Date(year + "-" + month + "-" + day + " " + element.hour);
      newGames[index].homeTeamScore = 0;
      newGames[index].awayTeamScore = 0;
    });
    
    // preparing new object Round
    let vl = +(<HTMLInputElement>document.getElementById("round-value")).value;
    /*let newRound: Round;
    newRound = this.lastRound;
    newRound.number++;
    newRound.value = vl;*/

    this.configService.createRound(vl, newGames)
    .subscribe(data => {
      this.appComponent.msgStandard("Rodada Criada", "Nova rodada criada com sucesso.", 3);
      this.router.navigate(['/home']);
    }, error => {
      this.appComponent.msgStandard("Falha", "Erro ao criar a rodada.", 4);
    });
  }

}
