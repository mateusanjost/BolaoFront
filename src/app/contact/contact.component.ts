import { Component, OnInit } from '@angular/core';

import { ConfigService } from '../config.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  userAdmin: any;

  constructor(private configService: ConfigService) { }

  ngOnInit() {
   
  }

}
