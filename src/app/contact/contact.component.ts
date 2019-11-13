import { Component, OnInit } from '@angular/core';

import { ConfigService } from '../config.service';
import { FormBuilder, Validators } from '@angular/forms';

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

  constructor(private configService: ConfigService, private fb: FormBuilder) { }

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


    this.configService.sendMessage(contact)
    .subscribe(data => {
      alert("Mensagem enviada com sucesso.")
      this.contactForm.reset();
    }, error => {
      console.log(error);
    });
  }

}
