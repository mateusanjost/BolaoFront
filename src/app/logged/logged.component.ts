import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ConfigService } from '../config.service';
import { AppComponent } from '../app.component';
import { Login } from '../login.interface';
import { User } from '../user.interface';

@Component({
  selector: 'app-logged',
  templateUrl: './logged.component.html',
  styleUrls: ['./logged.component.scss']
})
export class LoggedComponent implements OnInit {

  key: string = "";
  public cookie: string;

  constructor(private configService: ConfigService, 
    private cookieService: CookieService, private route: ActivatedRoute,
    private router: Router, private appComponent: AppComponent) { }

  ngOnInit() {
    if (!this.appComponent.userAdmin){
      this.key = this.route.snapshot.paramMap.get("key");
      this.checkLogged();
    }
    else {
      this.router.navigate(['/home']);
    }

  }

  checkLogged() {
    this.configService.checkLogged(this.key)
    .subscribe((data: User) => {
      this.cookieService.set('user', JSON.stringify(data.login));
      this.appComponent.userAdmin = data;
      this.appComponent.isLogged = true;

      this.router.navigate(['/home']);
      this.appComponent.checkCredit();
    }, error => {
      this.appComponent.msgStandard("Operação Falhou", "Não foi possível logar automaticamente.", 4);
      this.router.navigate(['/home']);
      console.log(error);
    });
  }

}
