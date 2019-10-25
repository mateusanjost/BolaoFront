import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';
import { Prize } from '../prize.interface';

@Component({
  selector: 'app-jackpot',
  templateUrl: './jackpot.component.html',
  styleUrls: ['./jackpot.component.scss']
})
export class JackpotComponent implements OnInit {

  jackpot: string;
  prizes: Prize;

  constructor(private configService: ConfigService) { }

  ngOnInit() {
    this.getPrize();
  }

  getPrize(){
    this.configService.getPrize()
    .subscribe(data => {
      this.prizes = data;
      this.jackpot = (this.prizes[0].gathered).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }, error =>{
      console.log(error);
    });
  }

  changeJackpot(){

    let newValue = (<HTMLInputElement>document.getElementById("jackpot")).value;
    let newPrizes: Prize;
    newPrizes = this.prizes[0];
    newPrizes.gathered = +newValue;
    newPrizes.type = 2;

    if (newValue != ""){
      
      this.configService.updateJackpot(newPrizes)
      .subscribe(data => {
        alert("Valor alterado com sucesso!");
        (<HTMLInputElement>document.getElementById("jackpot")).value = "";
        //(<HTMLInputElement>document.getElementById("jackpot")).setAttribute("placeholder", ('R$ ' + newValue));
        this.jackpot = (newPrizes.gathered).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      }, error => {
        console.log(error);
        alert("Houve algum erro de conexão!");
      });
    }
    else {
      alert("O campo não pode estar vazio!");
    }

     
  }

}
