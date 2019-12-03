import { Component, OnInit } from '@angular/core';

import { ConfigService } from '../config.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  userAdmin: any;

  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(10)]],
    message: ['', [Validators.required, Validators.minLength(20)]]
  });

  constructor(private configService: ConfigService, private fb: FormBuilder, private appComponent: AppComponent) { }

  ngOnInit() {
   
  }

  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get subject() { return this.contactForm.get('subject'); }
  get message() { return this.contactForm.get('message'); }

  sendMessage(){
    let contact = {
      name: this.name.value,
      email: this.email.value,
      subject: this.subject.value,
      message: this.message.value,
    }

    /* NOT USED ANY MORE
    this.configService.sendMessage(contact)
    .subscribe(data => {
      alert("Mensagem enviada com sucesso.")
      this.contactForm.reset();
    }, error => {
      console.log(error);
    });
    */

    this.configService.sendContactMessage(contact)
    .subscribe(data => {
      //alert("Mensagem enviada com sucesso! Agradecemos o contato e retornaremos em breve.");
      this.appComponent.msgStandard("Mensagem Enviada", "Agradecemos o contato e retornaremos em breve.", 3);
      this.contactForm.reset();
    }, error => {
      this.appComponent.msgStandard("Mensagem Não Enviada", "Houve algum erro no envio.", 4);
      console.log(error);
    });
  }

}
