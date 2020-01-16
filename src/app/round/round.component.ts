import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';

import { ConfigService } from '../config.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

import { BetradarComps } from '../betradar-comps';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.scss']
})
export class RoundComponent implements OnInit {
  @ViewChild('frame', { static: true }) modalCreate: ModalDirective;

  filteredOptions: Observable<BetradarComps[]>;

  formBetradar: FormGroup;
  betradarCompetitions: any;
  betradarMatches: any;
  tempGameId: number = 0;

  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  
  isLoaded: boolean = false;

  constructor(private configService: ConfigService, private appComponent: AppComponent, private router: Router) { }

  ngOnInit() {
    this.listBetradarCompetitions();
    
    this.formBetradar = new FormGroup({
      myControl: new FormControl('', Validators.required)
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
      //console.log(this.betradarMatches);
    }, error => {
      console.log(error);
    });
  }

  addGame(match: string, date: string, hour: string){
    this.tempGameId += 1;

    let msg1 = match;
    var msgContainer = document.createElement('div');
    msgContainer.id = 'game' + this.tempGameId; // No setAttribute required
    msgContainer.className = 'box-style' // No setAttribute required, note it's "className" to avoid conflict with JavaScript reserved word

    let msg2 = date;
    var msgContainer2 = document.createElement('div');
    msgContainer2.id = 'date' + this.tempGameId;
    msgContainer2.className = 'box-style';
    
    let msg3 = hour;
    var msgContainer3 = document.createElement('div');
    msgContainer3.id = 'hour' + this.tempGameId;
    msgContainer3.className = 'box-style';

    let msg4 = "remover";
    var msgContainer4 = document.createElement('button');
    msgContainer4.id = 'trash' + this.tempGameId;
    msgContainer4.className = 'trash-style';
    msgContainer4.addEventListener("click", (e:Event) => this.removeGame(this.tempGameId));

    var msgContainer5 = document.createElement('hr');
    msgContainer5.id = 'line' + this.tempGameId;

    msgContainer.appendChild(document.createTextNode(msg1));
    msgContainer2.appendChild(document.createTextNode(msg2));
    msgContainer3.appendChild(document.createTextNode(msg3));
    msgContainer4.appendChild(document.createTextNode(msg4));
    document.getElementById("creation-area").appendChild(msgContainer);
    document.getElementById("creation-area").appendChild(msgContainer2);
    document.getElementById("creation-area").appendChild(msgContainer3);
    document.getElementById("creation-area").appendChild(msgContainer4);
    document.getElementById("creation-area").appendChild(msgContainer5);
  }

  removeGame(idElement: number){

    console.log("id element: " + idElement);

    var el1 = document.getElementById('game' + idElement);
    el1.parentNode.removeChild(el1);
    var el2 = document.getElementById('date' + idElement);
    el2.parentNode.removeChild(el2);
    var el3 = document.getElementById('hour' + idElement);
    el3.parentNode.removeChild(el3);
    var el4 = document.getElementById('line' + idElement);
    el4.parentNode.removeChild(el4);
    var el5 = document.getElementById('trash' + idElement);
    el5.parentNode.removeChild(el5);
    
  }

}
