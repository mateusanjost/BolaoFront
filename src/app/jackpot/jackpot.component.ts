import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';
import { Prize } from '../prize.interface';
import { AppComponent } from '../app.component';
import { TranslateService } from '@ngx-translate/core';
import { Round } from '../round.interface';

@Component({
  selector: 'app-jackpot',
  templateUrl: './jackpot.component.html',
  styleUrls: ['./jackpot.component.scss']
})
export class JackpotComponent implements OnInit {

  jackpot: string;
  prizes: Prize;
  rounds: Round[] = [];

  constructor(private configService: ConfigService, private appComponent: AppComponent,
    private translate: TranslateService) {
    this.translate.setDefaultLang(this.appComponent.activeLang);
   }

  ngOnInit() {
    this.getRoundsOpened();
  }

  getRoundsOpened() {
    this.configService.getRoundsOpended()
    .subscribe(data => {
      this.rounds = data;
    }, error => {
      console.log(error);
    });
  }

  getRoundJackpot(roundId: number){
    this.configService.getRoundJackpot(roundId)
    .subscribe(data => {
      this.prizes = data;
      //console.log(data);
      this.jackpot = (this.prizes.gathered).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }, error =>{
      console.log(error);
    });
  }

  changeJackpot(){

    let newValue = (<HTMLInputElement>document.getElementById("jackpot")).value;
    let newPrizes: Prize;
    newPrizes = this.prizes;
    newPrizes.gathered = +newValue;
    newPrizes.type = 2;

    if (newValue != ""){
      
      this.configService.updateRoundJackpot(newPrizes)
      .subscribe(data => {
        this.appComponent.msgStandard(this.translate.instant("pg-jackpot.jackpot-changed"), this.translate.instant("pg-jackpot.jackpot-changed-info"), 3);
        (<HTMLInputElement>document.getElementById("jackpot")).value = "";
        this.jackpot = (newPrizes.gathered).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      }, error => {
        this.appComponent.msgStandard(this.translate.instant("pg-jackpot.operation-failed"), this.translate.instant("pg-jackpot.operation-failed-info"), 4);
        console.log(error);
      });
    }
    else {
      this.appComponent.msgStandard(this.translate.instant("pg-jackpot.empty-field"), this.translate.instant("pg-jackpot.empty-field-info"), 4);
    }
  }

}
