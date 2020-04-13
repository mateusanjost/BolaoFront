import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-rule',
  templateUrl: './rule.component.html',
  styleUrls: ['./rule.component.scss']
})
export class RuleComponent implements OnInit {

  constructor(private appComponent: AppComponent, private translate: TranslateService) {
    this.translate.setDefaultLang(this.appComponent.activeLang);
   }

  ngOnInit() {
  }

}
