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
  tempGameId: number;

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
      console.log(this.betradarMatches);
    }, error => {
      console.log(error);
    });
  }

  addGame(param1: string, param2: string, param3: string){
    this.tempGameId += 1;

    let msg1 = param1;
    var msgContainer = document.createElement('div');
    msgContainer.id = 'game' + this.tempGameId; // No setAttribute required
    msgContainer.className = 'col-5 space-padding' // No setAttribute required, note it's "className" to avoid conflict with JavaScript reserved word

    let msg2 = param2;
    var msgContainer2 = document.createElement('div');
    msgContainer2.id = 'date' + this.tempGameId;
    msgContainer2.className = 'col-3 space-padding';
    
    let msg3 = param3;
    var msgContainer3 = document.createElement('div');
    msgContainer3.id = 'hour' + this.tempGameId;
    msgContainer3.className = 'col-2 space-padding';

    let msg4 = "X";
    var msgContainer4 = document.createElement('a');
    msgContainer4.id = 'trash' + this.tempGameId;
    msgContainer4.className = 'col-1 space-padding';
    msgContainer4.href = '#';

    var msgContainer5 = document.createElement('hr');

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

}
