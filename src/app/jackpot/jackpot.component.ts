import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';
import { Prize } from '../prize.interface';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-jackpot',
  templateUrl: './jackpot.component.html',
  styleUrls: ['./jackpot.component.scss']
})
export class JackpotComponent implements OnInit {

  jackpot: string;
  prizes: Prize;

  constructor(private configService: ConfigService, private appComponent: AppComponent) { }

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
        //alert("Valor alterado com sucesso!");
        this.appComponent.msgStandard("Acumulado Alterado", "Valor alterado com sucesso.", 3);
        (<HTMLInputElement>document.getElementById("jackpot")).value = "";
        //(<HTMLInputElement>document.getElementById("jackpot")).setAttribute("placeholder", ('R$ ' + newValue));
        this.jackpot = (newPrizes.gathered).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      }, error => {
        console.log(error);
        //alert("Houve algum erro de conexão!");
        this.appComponent.msgStandard("Operação Não Realizada", "Erro na alteração do acumulado.", 4);
      });
    }
    else {
      //alert("O campo não pode estar vazio!");
      this.appComponent.msgStandard("Campo Vazio", "O campo não pode estar vazio.", 4);
    }

     
  }

}
